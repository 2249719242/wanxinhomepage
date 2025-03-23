import time
import os
import requests
import httpx
import re
import wave
from pydub import AudioSegment
from audio_separator.separator import Separator
import subprocess
import torch
from hypercorn.config import Config
from hypercorn.asyncio import serve
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64  # 添加 base64 模块导入
import flask
import json
import openai
app = Flask(__name__)
app.config["DEBUG"] = True

# 初始化OpenAI客户端
client = openai.OpenAI(
    api_key="sk-tLcSzjc5fMIB3so0E68436C7BdFe4062998e0f1f78Eb15B4",
    base_url="https://api.vveai.com/v1/"
)
CORS(app)  # 允许跨域
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


token = 'xqm8k0vw6cvlapuboxveg51fy6ypus'  # 请将这里的'YOUR_TOKEN'替换为你实际获取的token
# cookie = ""  # 请将这里的'YOUR_COOKIE'替换为你实际获取的cookie
cookie = "MUSIC_A_T=1530460507262; MUSIC_R_T=1530460560810; WEVNSM=1.0.0; ntes_utid=tid._.Ki6xp1srQ01BRhEURReRw%252BbuQt8E7ywR._.0; WM_TID=K%2BR1KH6XMtdFRUBARVKUxufqQsoSEx4c; __snaker__id=Q6dpCLdOzKrD4Q8l; ntes_kaola_ad=1; MUSIC_U=00EF144CEBBADDEEAEAEF007AA91772EF3A5333EAEAE668B6AE686DB0DE0047939ADA85FFCE3C4A1790E953A39DF3200743E82CD9BE6E6921EE4DE82A3B2CE5DDAF9F8EEBC0B74719FA0184195229661999811E62D1F02D5A16126EFBF55D43A17490C61B50CE1A872528C380E50C0C07A8B77B77119AFD0F3CB7DD38C499B84526E892E350AE7F00F6D05481789DB245F5CB8608BAD2A44C9AAB3DE31E329C696C91930D5C2489E2E8CEC253562A0F42F6816271F4F2FE4BE2169BB2F36DDD94824375DA04C0FBB9F9AB6CD34185D6E3D620AA420BFD3729189AA48F12E2964849D1F379831E0972F6E677724895E292073890101880D3EA07294BF5A158E82F794075B550609A7FD23B09C918C34B00876E3387E47C9BC8478798E6CC1643503FCF7697A232C21A6E4A90E4C1F0E9CD7FFE6943ACBB1B8BACB4716649B06CE88920E94F9C15B43FB7EDE1606FAE46EFAFC994C3264EC488B9DFEF36EFFA0C71EBD9D3C1A90D70EC35973A5EA780CCBA6; __remember_me=true; _iuqxldmzr_=32; Qs_lvt_382223=1729659434; _ga=GA1.1.1827349827.1729659438; _clck=157rtwz%7C2%7Cfq9%7C0%7C1757; Qs_pv_382223=242568461296104060%2C3639316680175065600%2C1385077227331153700%2C1648293200579800000%2C1844064905126289700; _ga_C6TGHFPQ1H=GS1.1.1729665682.2.1.1729665683.0.0.0; NMTID=00Ouy-pAgHxl_qSZk1fvJLKyTYaB7sAAAGUhOPEog; _ntes_nnid=9cc4f49323cb65cc46edd1f0944279ed,1737396306891; _ntes_nuid=9cc4f49323cb65cc46edd1f0944279ed; WNMCID=kfqbit.1737396308198.01.0; sDeviceId=YD-E%2FlZUDXLzC5AVlAFQAeVh%2BO7E45EqixJ; __csrf=c4df95f69a8ce19848500778adc9a0f1; __csrf=c4df95f69a8ce19848500778adc9a0f1; JSESSIONID-WYYY=%2BE0f5%5C0Rv7o02vot0bKMOJFV%2BNZXTWbTOI7bglxuYBR13r1PoAgw2dnsv2ziuArZ7Fm2gE9NGKOKTCbV%2B71nzUJppZQIfkGBpJuq1O5HnprHib8ir9jzlgGbk4x9TYhSq0XlXBqNvweP0ph72X7qafZVBjc2aJ6SJ1Yac2HB25FAO0Pa%3A1740846924031; WM_NI=cIycOSFt3DhNvxZ7sS8Mcchf%2FdKjMUySh7VpM5SkVzwgviHY3hUIkQScpC%2BfVpC%2B2hlKCZYV37TP5NSpsZxUpFkVP8kMp5JC%2FGcq5AWYOmoYawh5fCVNG7nOWMQg76pdM1E%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eeb7d43d979dfbb7e145f8b48aa6d54a978a8eadd752ab969682b24485a698d9f02af0fea7c3b92aa197b784ce5986acfda5eb46b6a896d8f259fc93ad84eb6eedbc858bd05fbb8da8d8d57c8feb9d8cd572b5b9ba8acb53f1b89baaea5b91bdc0a4aa6e96b08dccb164b0958dbbdc5ef1e99cb1b84691b0bdbbfb5fb49aa5b7d334a993c0d6c949ed99ad92b84b9587818eee53a3a9a8d6e549969289d8ed4595939f88b63eb4bc83d2c837e2a3"  # 请将这里的'YOUR_COOKIE'替换为你实际获取的cookie
if os.getenv('PATH').find('ffmpeg') == -1:
    os.environ['PATH'] += ';D:\\AI\\ffmpeg\\bin'
new_mdx_params = {"hop_length": 1024, "segment_size": 256, "overlap": 8, "batch_size": 2, "enable_denoise": False}
new_vr_params = {"batch_size": 2, "window_size": 512, "aggression": 5, "enable_tta": False, "enable_post_process": False, "post_process_threshold": 0.2, "high_end_process": False}
# model_name='liyi'
class Sovits_Music():
    # 插件加载时触发
    def __init__(self):
        pass
    # 当收到消息时触发
    # 监听路由
    async def process_message(self,receive_text):
        # 处理输入格式，支持空格或'-'分隔
        f0up = 0 
        model_name = 'fulilian' # 提取第三个方括号内的内容
        print('receive_text',receive_text)
        print('开始翻唱.')
        if receive_text:     
            dir_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "music")
            wav_path = os.path.join(dir_path, f'{receive_text}.wav')
            # 确保目录存在
            print('111111')
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
            id, artists, music_name = self.get_music_id(receive_text)
            print('2111111')
            if id:
                msg, url = self.get_music(id)
                if msg != "success":
                    print(f"{music_name} {artists}", msg)
                    id, artists, music_name = self.get_music_id(music, 1)
                    if id:
                        msg, url = self.get_music(id)
                if url:
                    music_name = music_name.replace('/', '&')
                    music_name = music_name.replace('"', '_')
                    music_name = music_name.replace("'", ' ')
                    music_name = music_name.replace(":", ' ')
                    music_name = music_name.replace("：", ' ')
                    artists = artists.replace('/', '&')
                    print('download_audio')
                    wav_path = self.download_audio(url, music_name, artists)
                    try:
                        print('UVR5')
                        self.UVR5(f"{music_name} {artists}")
                        print('UVR5 down')
                        music_artists=f"{music_name} {artists}"
                        dir_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "music")
                        music_path = os.path.join(dir_path, f"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12_(Vocals)_5_HP-Karaoke-UVR_(No Reverb)_UVR-DeEcho-DeReverb.wav")
                        
                        print('send_request')
                        gansheng_path = self.send_request(model_name, music_path, f"{music_artists}", int(f0up))
                        
                        if torch.cuda.is_available():
                            torch.cuda.empty_cache()
                            torch.cuda.synchronize()
                        print('send_request down')
                        hesheng_path = os.path.join(dir_path, f"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12_(Instrumental)_5_HP-Karaoke-UVR.wav")
                        banzou_path = os.path.join(dir_path, f"{music_artists}_(Instrumental)_model_bs_roformer_ep_368_sdr_12.wav")  
                        print('伴奏与和声加载完毕')
                        print('干声路径：', gansheng_path)
                        try:
                            print('hesheng_path检验')
                            if not self.is_pcm_s16le(hesheng_path):
                                print(f"和声 不是 16 位 PCM 格式，正在转换...")
                                output_path = os.path.splitext(hesheng_path)[0] + "_16bit.wav"
                                self.convert_to_pcm_s16le(hesheng_path, output_path)
                            print('gansheng_path检验')
                            if not self.is_pcm_s16le(gansheng_path):
                                print(f"干声 不是 16 位 PCM 格式，正在转换...")
                                output_path = os.path.splitext(gansheng_path)[0] + "_16bit.wav"
                                self.convert_to_pcm_s16le(gansheng_path, output_path)
                            print('banzou_path检验')
                            if not self.is_pcm_s16le(banzou_path):
                                print(f"伴奏 不是 16 位 PCM 格式，正在转换...")
                                output_path = os.path.splitext(banzou_path)[0] + "_16bit.wav"
                                self.convert_to_pcm_s16le(banzou_path, output_path)
                        except Exception as e:
                            #输出错误：
                            print("错误：", e)
                        # 加载干声
                        print('加载干声')
                        dry_vocals = AudioSegment.from_wav(gansheng_path)
                        print('加载干声完毕')
                        dry_vocals = dry_vocals + 4
                        print('成功+ 5')
                        print('加载伴奏和和声')
                        accompaniment = AudioSegment.from_wav(banzou_path)
                        harmony = AudioSegment.from_wav(hesheng_path)-5
                         #加载混响
                        print('加载混响')
                        Reverb_vocal_path=os.path.join(dir_path, fr"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12_(Vocals)_5_HP-Karaoke-UVR_(Reverb)_UVR-DeEcho-DeReverb.wav")
                        Reverb_vocal=AudioSegment.from_wav(Reverb_vocal_path)-5
                        #加载原唱的歌声，再-12
                        print('加载原唱的歌声')
                        raw_vocal_path=os.path.join(dir_path, fr"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12.wav")
                        print('开始转换')
                        raw_vocal=AudioSegment.from_wav(raw_vocal_path)
                        raw_vocal=raw_vocal-12
                        print('加载原唱的歌声，再-12db')
                        # 合并音轨(伴奏、原和声、翻唱干声、原唱-12db、混响)
                        print('开始合并音轨')
            
                        combined = accompaniment.overlay(harmony).overlay(dry_vocals).overlay(raw_vocal).overlay(Reverb_vocal)
                        print('合并音轨完毕')
                        Sovits_Music_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "RVC_Music")
                        output_file_path = os.path.join(Sovits_Music_path, f"{music_artists}_{model_name}.wav")
                        # 导出最终合成的歌曲
                        print('开始导出')
                        combined.export(output_file_path, format="wav")
                        print('导出完毕')
                        if not self.is_pcm_s16le(output_file_path):
                            print(f"伴奏 不是 16 位 PCM 格式，正在转换...")
                            output_path = os.path.splitext(output_file_path)[0] + "_16bit.wav"
                            self.convert_to_pcm_s16le(output_file_path, output_path)
                        print('开始发送')
                        # 将output_file_path发送给用户
                        # 删除临时文件
                        os.remove(gansheng_path)
                        os.remove(hesheng_path)                        
                        os.remove(os.path.join(dir_path, fr"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12.wav"))
                        os.remove(banzou_path)
                        os.remove(os.path.join(dir_path, fr"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12_(Vocals)_5_HP-Karaoke-UVR.wav"))
                        os.remove(os.path.join(dir_path, fr"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12_(Vocals)_5_HP-Karaoke-UVR_(No Reverb)_UVR-DeEcho-DeReverb.wav"))
                        os.remove(os.path.join(dir_path, fr"{music_artists}_(Vocals)_model_bs_roformer_ep_368_sdr_12_(Vocals)_5_HP-Karaoke-UVR_(Reverb)_UVR-DeEcho-DeReverb.wav"))
                        #os.remove(silk_path)
                        os.remove(wav_path)
                        return output_file_path
                    except Exception as e:
                        print(f"处理消息时出错: {str(e)}")
                        return jsonify({
                            'status': 'error',
                            'reply': f'处理失败: {str(e)}'
                        })
            else:
                print("提取音乐名称失败")

    def get_music_id(self, music_name, i=0):
        url = "https://v2.alapi.cn/api/music/search"
        params = {
            "keyword": music_name,
            "token": token,
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()["data"]
            song_id = data['songs'][i]['id']
            artists = data['songs'][i]['artists'][0]['name']
            get_music_name = data['songs'][i]['name']
            return song_id, artists, get_music_name
        except httpx.HTTPStatusError as e:
            print(f"获取音乐 id 失败:" + str(e))
            return None
        

    def get_music(self, id):
        time.sleep(1)
        url = "https://v2.alapi.cn/api/music/url"
        params = {
            "id": id,
            "format": "json",
            "token": token,
            'cookie': cookie,
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()["data"]
        msg = response.json()["message"]
        if data:
            url = data["url"]
            return msg, url
        else:
            url = None
            return msg, url

    def download_audio(self, audio_url, music_name, artists):
        dir_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "music")
        mp3_path = os.path.join(dir_path, f"{music_name} {artists}.mp3")
        wav_path = os.path.join(dir_path, f"{music_name} {artists}.wav")
        flac_path = os.path.join(dir_path, f"{music_name} {artists}.flac")
        if re.search("flac", audio_url):
            file_type = "flac"
            file_path = flac_path
        elif re.search("mp3", audio_url):
            file_type = "mp3"
            file_path = mp3_path
        else:
            file_type = "wav"
            file_path = wav_path
        try:
            response = requests.get(audio_url)
            if response.status_code == 200:
                with open(file_path, "wb") as file:
                    file.write(response.content)
                print(f"音频文件已成功保存为" + file_path)
                try:
                    # 加载 音频 文件
                    audio = AudioSegment.from_file(file_path, format=file_type)
                    # 导出为 WAV 格式
                    audio.export(wav_path, format="wav")
                    print(f"文件已成功从 {file_type} 转换为 WAV 并保存为 {wav_path}")
                    # 删除 原音频 文件
                    os.remove(file_path)
                    return wav_path
                except Exception as e:
                    print(f"转换音频文件发生异常: {str(e)}")
                    return False
            else:
                print(f"下载音频文件失败，状态码{response.status_code}")
                return False
        except Exception as e:
            print(f"下载音频文件发生异常" + str(e))
            return False


    def UVR5(self, music_name):
        #music_name:{music_name} {artists}
        # Initialize the Separator class (with optional configuration properties, below)
        try:
            dir_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "music")
            tmp_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "tmp")
            models_path = os.path.join(tmp_path, "audio-separator-models")
            separator = Separator(output_dir=dir_path, model_file_dir=models_path, mdx_params=new_mdx_params, vr_params=new_vr_params)
            # music_name = music_name
            # 1、去伴奏
            # separator.output_single_stem = "Vocals"
            separator.load_model("model_bs_roformer_ep_368_sdr_12.9628.ckpt")
            # Perform the separation on specific audio files without reloading the model
            output_files = separator.separate(os.path.join(dir_path, f"{music_name}.wav"))
            print(f"Separation complete! Output file(s): {' '.join(output_files)}")
            # 清理显存
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.cuda.synchronize()  
            # 2、去和声
            # 6_HP-Karaoke-UVR.pth 少激进
            # 5_HP-Karaoke-UVR.pth 多激进
            separator.load_model("5_HP-Karaoke-UVR.pth")
            # Perform the separation on specific audio files without reloading the model
            output_files = separator.separate(os.path.join(dir_path, f"{music_name}_(Vocals)_model_bs_roformer_ep_368_sdr_12.wav"))
            print(f"Separation complete! Output file(s): {' '.join(output_files)}")
            # 3、去混响
            # UVR-De-Echo-Normal.pth 少量混响
            # UVR-De-Echo-Aggressive.pth 中等混响
            #   .pth  大量混响/正常混响
            # separator.output_single_stem = "Vocals"
            separator.load_model("UVR-DeEcho-DeReverb.pth")
            # Perform the separation on specific audio files without reloading the model
            output_files = separator.separate(os.path.join(dir_path, f"{music_name}_(Vocals)_model_bs_roformer_ep_368_sdr_12_(Vocals)_5_HP-Karaoke-UVR.wav"))
            print(f"Separation complete! Output file(s): {' '.join(output_files)}")
        # 最后确保清理所有显存
        finally:   # 清理 CUDA 缓存
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.cuda.synchronize()  # 确保所有 CUDA 操作完成
                import gc
                gc.collect()  # 触发 Python 垃圾回收

    def send_request(self,model_name, file_path, music_artists, f0up):
          #music_name={music_name} {artists}
            if any(keyword in model_name for keyword in ['闹闹', '东山', '奈央', '由比', '滨结衣', '结衣','dongshan']):
                speaker = 'dongshan'
            elif any(keyword in model_name for keyword in ['花音', 'jelee', '李依原声', '水母']):
                speaker = 'jelee'
            elif any(keyword in model_name for keyword in ['轻井泽惠', 'hui']):
                speaker = 'hui'       
            elif any(keyword in model_name for keyword in ['luge']):
                speaker = 'luge'
            elif any(keyword in model_name for keyword in ['坂柳', 'banliu']):
                speaker = 'banliu'
            elif any(keyword in model_name for keyword in ['fulilian ', '芙莉莲']):
                speaker = 'fulilian'   
            else:
                speaker = 'liyi'
            url = "http://localhost:1145/wav2wav"
            # 准备请求参数
            data = {
                "audio_path": file_path,  # 直接传入文件路径
                "tran": f0up,               # 可以根据需要调整音调
                "spk": speaker,               # 可以根据需要指定说话人
                "wav_format": "wav"      # 输出格式
            }
            try:
                # 发送POST请求
                response = requests.post(url, data=data)
                response.raise_for_status()
                
                # 保存响应内容为.wav文件
                dir_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "music")
                output_file_path = os.path.join(dir_path, f"临时干声{music_artists}.wav")
                
                # 确保输出目录存在
                os.makedirs(dir_path, exist_ok=True)
                
                # 保存文件
                with open(output_file_path, "wb") as f:
                    f.write(response.content)
                print(f"文件已保存到: {output_file_path}")
                return output_file_path
                
            except requests.exceptions.RequestException as e:
                print(f"请求失败: {e}")
                return None
            except IOError as e:
                print(f"保存文件失败: {e}")
                return None
            # 保存响应内容为 .wav 文件
            dir_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), "music")
            output_file_path = os.path.join(dir_path, f"临时干声{music_artists}.wav")
            try:
                with open(output_file_path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:  # 过滤保持活跃的块
                            f.write(chunk)
                print(f"文件已保存到: {output_file_path}")
            except IOError as e:
                print(f"保存文件失败: {e}")
                return None
            return output_file_path
    def get_index(self, model_name):
        # 目标文件夹路径
        folder_path = os.path.join(RVC_logs_path, model_name)

        # 获取文件夹中的所有文件
        all_items = os.listdir(folder_path)

        # 过滤只获取文件（排除子文件夹），并获取文件的完整路径
        file_paths = [os.path.join(folder_path, f) for f in all_items if os.path.isfile(os.path.join(folder_path, f))]

        # 假设只有一个文件，获取该文件的路径
        if file_paths:
            file_path = file_paths[0]
            return file_path
        else:
            print("获取index文件失败")
            return None
    def sendwav(self,output_file_path):
        # output_file_path = r'D:\AI\AIchatbot\QChatGPT\plugins\LangBot_RVC_Music\RVC_Music\私は最_jelee.wav'
        if os.path.exists(output_file_path):
            print('开始发送翻唱音频')
            try:
                # 将音频文件转换为 base64 字符串
                with open(output_file_path, 'rb') as audio_file:
                    audio_data = audio_file.read()
                    audio_base64 = base64.b64encode(audio_data).decode('utf-8')
                
                return jsonify({
                    'status': 'success',
                    'audioUrl': f"data:audio/wav;base64,{audio_base64}",
                    'reply': '音频生成成功'
                })
            except Exception as e:
                return jsonify({
                    'status': 'error',
                    'reply': f'音频文件处理失败: {str(e)}'
                })
        else:
            return jsonify({
                'status': 'error',
                'reply': '音频文件生成失败'
            })
    def is_pcm_s16le(self, file_path):
    #检查 .wav 文件是否为 16 位 PCM (pcm_s16le)
        try:
            # 首先检查文件是否存在
            if not os.path.exists(file_path):
                print(f"文件不存在: {file_path}")
                return False
                
            # 检查文件大小
            if os.path.getsize(file_path) == 0:
                print(f"文件大小为0: {file_path}")
                return False
                
            # 设置超时时间
            import signal
            def timeout_handler(signum, frame):
                raise TimeoutError("读取文件超时")
            
            # 设置5秒超时
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(5)
            
            try:
                with wave.open(file_path, 'rb') as wf:
                    sample_width = wf.getsampwidth()
                    return sample_width == 2  # 16位音频每个采样点占用2字节
            finally:
                signal.alarm(0)  # 取消超时
            
        except wave.Error as e:
            print(f"Wave错误: {file_path} - {str(e)}")
            return False
        except TimeoutError as e:
            print(f"超时错误: {file_path} - {str(e)}")
            return False
        except Exception as e:
            print(f"未知错误: {file_path} - {str(e)}")
            return False

    def convert_to_pcm_s16le(self, input_path, output_path):
        """使用 ffmpeg 将 .wav 文件转换为 16 位 PCM 格式"""
        try:
            # 使用 ffmpeg 进行转换
            subprocess.run([
                'ffmpeg', '-i', input_path,
                '-acodec', 'pcm_s16le',  # 转换为 16 位 PCM
                output_path
            ], check=True)
            # 删除原文件
            os.remove(input_path)

            # 将转换后的文件重命名为原文件名
            os.rename(output_path, input_path)
            print(f"文件转换并替换成功: {input_path}")
        except subprocess.CalledProcessError as e:
            print(f"转换失败: {e}")

    # 插件卸载时触发
    def __del__(self):
        pass
# 用于存储对话历史的字典，键为会话ID，值为消息列表
conversation_history = {}
aimodel='claude-3-5-sonnet-20241022'
@app.route('/api/chat', methods=['POST', 'GET'])
async def chat():
    # 根据请求方法获取消息内容和会话ID
    if request.method == 'POST':
        ctx = request.json
        receive_text = ctx.get('message', '')
        session_id = ctx.get('session_id', str(hash(request.remote_addr + str(request.user_agent))))
    else:  # GET方法
        print('GET')
        receive_text = request.args.get('message', '')
        session_id = request.args.get('session_id', str(hash(request.remote_addr + str(request.user_agent))))
    print(f"Session ID: {session_id}, Message: {receive_text}")
    
    # 确保会话历史存在
    if session_id not in conversation_history:
        conversation_history[session_id] = []
    
    # 检查是否包含"翻唱歌曲"
    if '翻唱歌曲' in receive_text:
        sovits = Sovits_Music()
        # 提取歌曲名称（去掉"翻唱歌曲"这四个字）
        song_name = receive_text.replace('翻唱歌曲', '').strip()
        # 调用 Sovits_Music 的方法
        output_path = await sovits.process_message(song_name)
        # 在返回音频前，将当前消息添加到历史记录中
        conversation_history[session_id].append({"role": "user", "content": receive_text})
        conversation_history[session_id].append({"role": "assistant", "content": f"[生成了翻唱音频{song_name}]"})
        return sovits.sendwav(output_path)
    else:
        print('流式')
        def generate():
            try:
                yield 'data: {"status": "start"}\n\n'
                
                conversation_history[session_id].append({"role": "user", "content": receive_text})
                messages_to_send = conversation_history[session_id][-10:] if len(conversation_history[session_id]) > 10 else conversation_history[session_id]
                
                # 使用 OpenAI 的流式响应
                stream = client.chat.completions.create(
                    model=aimodel,
                    messages=messages_to_send,
                    stream=True
                )
                
                full_response = ""
                for chunk in stream:
                    if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        full_response += content
                        yield f'data: {{"status": "streaming", "content": {json.dumps(content)}}}\n\n'
                
                conversation_history[session_id].append({"role": "assistant", "content": full_response})
                yield f'data: {{"status": "complete", "full_content": {json.dumps(full_response)}, "session_id": {json.dumps(session_id)}}}\n\n'
                
            except Exception as e:
                error_message = f"处理请求时发生错误: {str(e)}"
                yield f'data: {{"status": "error", "error": {json.dumps(error_message)}}}\n\n'
        try:
            return flask.Response(generate(), mimetype='text/event-stream')
        except Exception as e:
            return jsonify({
                'status': 'error',
                'reply': f'无法创建对话: {str(e)}'
            })
if __name__ == '__main__':
    config = Config()
    config.bind = ["0.0.0.0:5000"]
    asyncio.run(serve(app, config))