import anthropic
import flask
import json
from flask import request, jsonify
from sovits_music import Sovits_Music
app = flask.Flask(__name__)
app.config["DEBUG"] = True

client = anthropic.Anthropic(
    # defaults to os.environ.get("ANTHROPIC_API_KEY")
    api_key="sk-tLcSzjc5fMIB3so0E68436C7BdFe4062998e0f1f78Eb15B4",
    base_url="https://api.vveai.com/v1"  
)
# 用于存储对话历史的字典，键为会话ID，值为消息列表
conversation_history = {}
@app.route('/api/chat', methods=['POST', 'GET'])
async def chat():
    # 根据请求方法获取消息内容
    if request.method == 'POST':
        ctx = request.json
        receive_text = ctx.get('message', '')
    else:  # GET方法
        print('GET')
        receive_text = request.args.get('message', '')
    print(receive_text)
    
    # 检查是否包含"翻唱歌曲"
    if '翻唱歌曲' in receive_text:
        sovits = Sovits_Music()
        # 提取歌曲名称（去掉"翻唱歌曲"这四个字）
        song_name = receive_text.replace('翻唱歌曲', '').strip()
        # 调用 Sovits_Music 的方法
        output_path = await sovits.process_message(song_name)
        # 在返回音频前，将当前消息添加到历史记录中
        # 注意：这里不需要显式更新历史记录，因为前端会在下一次请求时发送完整历史
        return sovits.sendwav(output_path)
    else:
        print('流式')
        # 使用流式响应
        def generate():
            try:
                # 初始化响应头
                yield 'data: {"status": "start"}\n\n'
                
                # 创建流式消息
                with client.messages.stream(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1024,
                    messages=[{"role": "user", "content": receive_text}]
                ) as stream:
                    # 收集完整响应
                    full_response = ""
                    
                    # 处理每个块
                    for text in stream.text_stream:
                        full_response += text
                        # 发送当前块
                        yield f'data: {{"status": "streaming", "content": {json.dumps(text)}}}\n\n'
                    
                    # 发送完成信号
                    yield f'data: {{"status": "complete", "full_content": {json.dumps(full_response)}}}\n\n'
            except Exception as e:
                # 其他未预期的错误
                error_message = f"处理请求时发生错误: {str(e)}"
                yield f'data: {{"status": "error", "error": {json.dumps(error_message)}}}\n\n'
        try:
            # 返回流式响应
            return flask.Response(generate(), mimetype='text/event-stream')
        except Exception as e:
            # 如果流式响应创建失败，返回 JSON 错误响应
            return jsonify({
                'status': 'error',
                'reply': f'无法创建对话: {str(e)}'
            })
if __name__ == '__main__':
    config = Config()
    config.bind = ["0.0.0.0:5000"]
    asyncio.run(serve(app, config))