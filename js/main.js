    const GAS_API_URL = "https://script.google.com/macros/s/AKfycby733s7oboPlU-UFYo2rLQ08OaIGawK3Uxh0Fz0_GO4GalLlTFDp-9z5GqWnlDb-YKRpw/exec"; 

    if (typeof google === 'undefined') {
        window.google = { script: { run: createGasPolyfill() } };
    }

    function createGasPolyfill() {
        let _success = null; let _failure = null;
        const runner = new Proxy({}, {
            get: function(target, prop) {
                if (prop === 'withSuccessHandler') return function(h) { _success = h; return runner; };
                if (prop === 'withFailureHandler') return function(h) { _failure = h; return runner; };
                return function(...args) {
                    const sHandler = _success; const fHandler = _failure;
                    _success = null; _failure = null;
                    fetch(GAS_API_URL, {
                        method: 'POST',
                        body: JSON.stringify({ action: prop, args: args }),
                        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.error && fHandler) fHandler(data.error);
                        else if (sHandler) sHandler(data);
                    })
                    .catch(err => { if (fHandler) fHandler(err); });
                };
            }
        });
        return runner;
    }
    function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };
        return charsToReplace[tag] || tag;});}
    const chatBox = document.getElementById('chat-box');
    const inputField = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const statusDot = document.getElementById('status-dot');
    const thoughtCloud = document.getElementById('thought-cloud');
    const emptySleep = document.getElementById('empty-sleep-state');
    const dreamContainer = document.getElementById('dream-container');
    window.guestSource = 'direct'; 
    // --- BẢO TRÌ M1 PRO LOGIC (NGỦ GIẢ) ---
    let matrixTimer = null;
    let terminalTimer = null; 
    const terminalLogLines = []; 

    function toggleM1Maintenance(isActive) {
        const maintState = document.getElementById('maint-state-container');
        const rainContainer = document.getElementById('matrix-rain-container');
        const tooltip = document.getElementById('secret-tooltip'); 
        
        if (isActive) {
            chatBox.innerHTML = '';
            maintState.classList.remove('hidden');
            maintState.classList.add('flex');
            document.getElementById('maint-text-hint').innerText = translations[currentLang].maintHint;
            
            inputField.disabled = true;
            inputField.placeholder = translations[currentLang].maintPlaceholder;
            
            sendBtn.disabled = true;
            sendBtn.innerText = "...";

            statusDot.className = 'w-3 h-3 bg-red-500 rounded-full pulse-anim shadow-[0_0_10px_#ef4444] shrink-0';
            document.getElementById('bot-status').innerText = translations[currentLang].maintStatus;
            
            if (tooltip) tooltip.style.display = 'none'; 
            if (!matrixTimer) matrixTimer = setInterval(spawnMatrixCode, 250);
            if (!terminalTimer) terminalTimer = setInterval(spawnTerminalLog, 800);

        } else {
            maintState.classList.add('hidden');
            maintState.classList.remove('flex');
            
            clearInterval(matrixTimer);
            matrixTimer = null;
            if(rainContainer) rainContainer.innerHTML = '';
            
            clearInterval(terminalTimer);
            terminalTimer = null;
            terminalLogLines.length = 0; 
            const terminalEl = document.getElementById('maint-terminal');
            if (terminalEl) terminalEl.innerHTML = '';
            if (tooltip) tooltip.style.display = '';
        }
    }

    function spawnMatrixCode() {
        const container = document.getElementById('matrix-rain-container');
        if (!container || container.childElementCount > 30) return; 
        
        const el = document.createElement('div');
        el.className = 'matrix-code';
        const codes = ["010", "101", "SYS", "0xFA", "M1", "110"]; 
        el.innerText = codes[Math.floor(Math.random() * codes.length)];
        
        el.style.left = Math.random() * 100 + '%'; 
        const duration = 2.5 + Math.random() * 3; 
        el.style.animationDuration = duration + 's';
        el.style.fontSize = (10 + Math.random() * 10) + 'px';
        el.style.opacity = (Math.random() * 0.5 + 0.3).toString();
        
        container.appendChild(el);
        setTimeout(() => { if (el.parentNode) el.remove(); }, duration * 1000);
    }
    function spawnTerminalLog() {
        const terminal = document.getElementById('maint-terminal');
        if (!terminal) return;
        
        const prefixes = ["SYS", "OK", "WARN", "INFO", "DEBUG"];
        const phrases = [
            "Rebuilding Neural Core...", "Clearing Cache [OK]", "Bypassing Security Protocol...", 
            "Ping: 12ms", "Allocating RAM: 14.5GB", "[WARN] Temp rising: 82°C", 
            "Syncing Database...", "Fetching User Matrix...", "Decrypting Local Storage...",
            "Connecting to M1 Server..."
        ];
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const text = phrases[Math.floor(Math.random() * phrases.length)];
        let colorClass = "text-green-500/70";
        if (prefix === "WARN") colorClass = "text-yellow-500/80";
        if (prefix === "OK") colorClass = "text-cyan-500/80";

        const line = `<span class="${colorClass}">[${prefix}] ${text}</span>`;
        terminalLogLines.push(line);
        if (terminalLogLines.length > 5) terminalLogLines.shift(); 
        
        terminal.innerHTML = terminalLogLines.join('<br>');
    }

    let currentPersonalityName = "";
    const uiState = {
     isBlurry: false,
     isSneezing: false,
     isDartCooldown: false
    }; 

let currentLang = 'en'; 
try {
    let savedLang = localStorage.getItem('peih_lang');
    if (savedLang) {
        currentLang = savedLang; 
    } else {
        const sysLang = navigator.language || navigator.userLanguage;
        currentLang = sysLang.startsWith('vi') ? 'vi' : (sysLang.startsWith('ja') ? 'ja' : 'en');
        localStorage.setItem('peih_lang', currentLang);
    }
} catch (e) {
    const sysLang = navigator.language || navigator.userLanguage;
    currentLang = sysLang.startsWith('vi') ? 'vi' : (sysLang.startsWith('ja') ? 'ja' : 'en');
}

    let activeEggTimeouts = [];
    let currentSessionId = 'Guest_' + Math.random().toString(36).substr(2, 6).toUpperCase();
    let chatContextHistory = [];
    let eggMessageIds = []; 

    try {
        const savedId = localStorage.getItem('peih_chat_id');
        if (savedId) {
            currentSessionId = savedId;
        } else {
            localStorage.setItem('peih_chat_id', currentSessionId);
        }
        
        const savedHistory = localStorage.getItem('peih_context_' + currentSessionId);
        if (savedHistory) {
            chatContextHistory = JSON.parse(savedHistory);
        }
    } catch (error) {
        console.warn("Trình duyệt nhúng (IG/FB) đã chặn LocalStorage. Chạy chế độ ẩn danh.");
    }
    const firebaseConfig = { databaseURL: "https://peih-hotline-default-rtdb.firebaseio.com" };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    let isHotlineMode = false;
    let chatRef = null;
    let cmdRef = null;

    let isAIBlockedByAdmin = false; 

    function initFirebaseListeners() {
        const statusRef = database.ref('status/' + currentSessionId);
        statusRef.onDisconnect().remove();
        database.ref('chats/' + currentSessionId).onDisconnect().remove();

        statusRef.child('real_name').on('value', (snap) => {
            if (window.isSystemHalted) return; 

            const realName = snap.val();
            const inputEl = document.getElementById('user-input');
            
            window.currentRealName = realName; 

            if (realName && realName.trim() !== "" && !isAppSleeping && !isFakeSleeping && !isHotlineMode) {
                inputEl.placeholder = translations[currentLang].placeholderWithName.replace('{name}', realName);
            } else if (!isAppSleeping && !isFakeSleeping && !isHotlineMode) {
                inputEl.placeholder = translations[currentLang].placeholder; 
            }
        });

        statusRef.update({ 
            is_online: true, 
            last_active: Date.now(),
            hotline_active: isHotlineMode 
        });

        statusRef.child('ai_blocked').on('value', (snap) => {
            isAIBlockedByAdmin = snap.val() === true;
        });

        chatRef = database.ref('chats/' + currentSessionId);
        chatRef.on('child_added', (snapshot) => {
            const data = snapshot.val();

            if (data && data.sender === 'admin_cmd') {
                if (data.text === '/zelda') {
                    triggerZeldaEgg();
                } 
                else if (data.text === '/starbucks') {
                    triggerStarbucksEgg();
                } 
                else if (data.text === '/music') {
                    triggerMusicEgg();
                }
                return; 
            }

            if (data && data.sender === 'admin') {
                if (data.text === '/cut_wire') { 
                    if (isHotlineMode) toggleHotlineMode(false); 
                    return; 
                }
                if (data.text === '/logout') {
                    triggerLogoutEgg(); 
                    return;
                }
                appendRealAdminMsgToUI(data.text);
                chatContextHistory.push({role: "model", text: "REAL|" + data.text});
                chatBox.scrollTop = chatBox.scrollHeight;
                localStorage.setItem('peih_context_' + currentSessionId, JSON.stringify(chatContextHistory));   
            }
        });
        let initTime = Date.now();
        cmdRef = database.ref('system/global_command');
        cmdRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && data.command === '/end' && data.timestamp > initTime) {
                if (isHotlineMode) toggleHotlineMode(false);
            }
        });
    }

    initFirebaseListeners();

    function toggleHotlineMode(active) {
        isHotlineMode = active; 
        const wrapper = document.getElementById('main-chat-wrapper');
        const status = document.getElementById('bot-status');
        const btnClear = document.getElementById('btn-clear-chat');
        const btnEndCall = document.getElementById('btn-end-call');
        
        const statusRef = database.ref('status/' + currentSessionId);

        if(active) {
            wrapper.classList.add('chat-on-call'); 
            status.innerText = translations[currentLang].tinCanHeader; 
            status.style.color = '#ff4757';
            if(btnClear) btnClear.classList.add('hidden');
            if(btnEndCall) { 
                btnEndCall.classList.remove('hidden'); 
                btnEndCall.innerText = translations[currentLang].btnEndCall; 
            }
            appendSystemMsg(translations[currentLang].tinCanDivider); 
            inputField.placeholder = translations[currentLang].tinCanPlaceholder;
            statusRef.set({ hotline_active: true, last_seen: Date.now() });
        } else {
            wrapper.classList.remove('chat-on-call'); 
            status.innerText = document.body.classList.contains('doraemon-mode') 
                ? (currentLang === 'ja' ? "ドラえもん 🔔" : "Doraemon 🔔") 
                : translations[currentLang].status; 
            status.style.color = '';
            if(btnEndCall) btnEndCall.classList.add('hidden');
            if(btnClear) btnClear.classList.remove('hidden');
            
            appendSystemMsg(translations[currentLang].tinCanEnd); 
            inputField.placeholder = translations[currentLang].placeholder;
            statusRef.update({ hotline_active: false });
        }
    }

    let autoChatActive = false; 
    let chatSequenceId = 0; 
    let isAppSleeping = false; 
    let globalUIConfig = null;
    let isFakeSleeping = false;
    let fakeSleepStep = 0; 
    let isMusicPlaying = false;
    let musicPauseTimer = null; 
    let afkTimer = null;
    let isDeepSleep = false; 
    let dreamTimer = null;
    let dreamQueue = []; 
    let dartClicks = 0;
    let userMessageBuffer = []; 
    let typingTimer = null; 
    let userMsgCountForSummary = 0; 
    let failsafeTimer = null;
    let inputIdleTimer = null; 
    const BUFFER_LIMIT = 8; 
    
    let currentBubblesContainer = null; 
    let currentAdminBubblesContainer = null; 

function appendRealAdminMsgToUI(text) {
    if (!currentAdminBubblesContainer) {
        const groupWrapper = document.createElement('div');
        groupWrapper.className = 'flex items-end gap-1.5 w-full mb-1 mt-5';
        
        const avatarHtml = `<div class="w-8 h-8 shrink-0 avatar-container"><div class="crown-icon">👑</div><img src="${getAvatarUrl()}" class="w-full h-full rounded-full object-cover shadow-sm"></div>`;
        groupWrapper.innerHTML = avatarHtml;

        currentAdminBubblesContainer = document.createElement('div');
        currentAdminBubblesContainer.className = 'flex flex-col items-start gap-[3px] w-full';
        
        groupWrapper.appendChild(currentAdminBubblesContainer);
        chatBox.appendChild(groupWrapper);
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg-bubble real-person-bubble';
    msgDiv.innerHTML = text.replace(/\n/g, '<br>');
    
    const bubbles = currentAdminBubblesContainer.children;
    if (bubbles.length === 0) {
        msgDiv.style.borderRadius = "24px 24px 24px 6px";
    } else {
        bubbles[bubbles.length - 1].style.borderBottomLeftRadius = "6px";
        msgDiv.style.borderRadius = "6px 24px 24px 6px";
    }
    
    currentAdminBubblesContainer.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
    let currentReceiptDiv = null; 
    let previousReceiptDiv = null;

    let clientLat = null, clientLon = null, clientCity = null;

    async function fetchLocation() {
    if (sessionStorage.getItem('peih_tracked')) return;

    sessionStorage.setItem('peih_tracked', 'true');

    const fetch1 = fetch('https://get.geojs.io/v1/ip/geo.json').then(r=>r.json()).then(d => { if(d.latitude) return {lat: d.latitude, lon: d.longitude, city: d.city || d.region, name: 'GeoJS'}; throw 1; });
    const fetch2 = fetch('https://ipapi.co/json/').then(r=>r.json()).then(d => { if(d.latitude) return {lat: d.latitude, lon: d.longitude, city: d.city, name: 'ipapi'}; throw 2; });
    const fetch3 = fetch('https://ipwho.is/').then(r=>r.json()).then(d => { if(d.success && d.latitude) return {lat: d.latitude, lon: d.longitude, city: d.city, name: 'ipwho'}; throw 3; });

    try {
        const result = await Promise.any([fetch1, fetch2, fetch3]);
        clientLat = result.lat; 
        clientLon = result.lon; 
        clientCity = result.city || "một nơi nào đó";
        google.script.run.prefetchWeather(clientLat, clientLon, currentLang);
    } catch (error) {
        clientCity = "không biết";
    }
    google.script.run.trackVisit(window.guestSource, clientCity, clientLat, clientLon);
}
    const quotes = [
      { vi: '"Cuộc đời không được suy xét là cuộc đời không đáng sống." - Socrates', en: '"The unexamined life is not worth living." - Socrates', ja: '"吟味なき生に、生きる価値なし。" - ソクラテス' },
      { vi: '"Nơi mà ngôn từ thất bại, âm nhạc sẽ lên tiếng." - Hans C. Andersen', en: '"Where words fail, music speaks." - Hans C. Andersen', ja: '"言葉が尽きたところで、音楽が始まる。" - アンデルセン' },
      { vi: '"Marketing tuyệt vời làm cho khách hàng cảm thấy họ thông minh." - Joe Chernov', en: '"Great marketing makes the customer feel smart." - Joe Chernov', ja: '"偉大なマーケティングは顧客を賢く感じさせる。" - ジョー・チェルノフ' },
      { vi: '"Nếu bạn nghĩ mình hiểu vật lý lượng tử, bạn không hiểu nó đâu." - Richard Feynman', en: '"If you think you understand quantum mechanics, you don’t." - Richard Feynman', ja: '"量子力学を理解したと思うなら、それは理解できていない証拠だ。" - ファインマン' },
      { vi: '"Đổi mới là điều phân biệt giữa người lãnh đạo và kẻ theo sau." - Steve Jobs', en: '"Innovation distinguishes between a leader and a follower." - Steve Jobs', ja: '"革新こそがリーダーとフォロワーを分ける。" - スティーブ・ジョブズ' },
      { vi: '"Trí tưởng tượng quan trọng hơn kiến thức." - Albert Einstein', en: '"Imagination is more important than knowledge." - Albert Einstein', ja: '"想像力は知識よりも重要だ。" - アルベルト・アインシュタイン' },
      { vi: '"Sự đơn giản là đỉnh cao của sự tinh tế." - Leonardo da Vinci', en: '"Simplicity is the ultimate sophistication." - Leonardo da Vinci', ja: '"シンプルさは究極の洗練である。" - レオナルド・ダ・ヴィンチ' },
      { vi: '"Mỗi đứa trẻ đều là một nghệ sĩ. Vấn đề là làm sao để vẫn là nghệ sĩ khi đã lớn lên." - Pablo Picasso', en: '"Every child is an artist. The problem is how to remain an artist once he grows up." - Pablo Picasso', ja: '"子供は誰でも芸術家だ。問題は、大人になっても芸術家でいられるかどうかだ。" - パブロ・ピカソ' },
      { vi: '"May mắn là điều xảy ra khi sự chuẩn bị gặp gỡ cơ hội." - Seneca', en: '"Luck is what happens when preparation meets opportunity." - Seneca', ja: '"幸運とは、準備が機会に出会ったときに起こるものだ。" - セネカ' }
      ];

    let quoteIndex = 0;
    let doraQuoteIndex = 0; 
    const statusNote = document.getElementById('status-note');
    const doraQuotes = [
      // GIAN
      { vi: '"Vật của cậu là vật của tớ, vật của tớ vẫn là của tớ!" - Gian', en: '"What\'s yours is mine, and what\'s mine is mine!" - Gian', ja: '"おまえの物は俺の物、俺の物も俺の物！" - ジャイアン' },
      { vi: '"Điều tồi tệ nhất là nghĩ rằng bản thân mình vô dụng." - Doraemon', en: '"The worst thing is thinking you are useless." - Doraemon', ja: '"一番いけないのは自分なんかだめだと思いこむことだよ。" - ドラえもん' },
      { vi: '"Tớ sẽ không bỏ cuộc đâu, vì tớ là Nobita mà!" - Nobita', en: '"I won\'t give up, because I am Nobita!" - Nobita', ja: '"あきらめないよ、僕だもん！" - のび太' },
      { vi: '"Tiền bạc không mua được trái tim, nhưng nó mua được đồ chơi xịn!" - Suneo', en: '"Money can\'t buy hearts, but it buys cool toys!" - Suneo', ja: '"ボクのパパは社長なんだよ！" - スネ夫' },
      { vi: '"Cứ vấp ngã đi, rồi cậu sẽ lớn khôn." - Doraemon', en: '"Stumble and fall, then you will grow." - Doraemon', ja: '"ころんで起きあがるときに、何かをつかみとるんだ。" - ドラえもん' },
      { vi: '"Nếu không thể cảm nhận nỗi đau của người khác, ta không thể trưởng thành." - Shizuka', en: '"If you can\'t feel others\' pain, you can\'t grow." - Shizuka', ja: '"人の痛みがわかる人になってね。" - しずか' },
      { vi: '"Bảo bối tuyệt vời nhất chính là bộ não của cậu đấy." - Doraemon', en: '"Your brain is the most wonderful gadget." - Doraemon', ja: '"君の脳みそが一番のひみつ道具だよ。" - ドラえもん' },
      { vi: '"Hạnh phúc của người khác cũng chính là hạnh phúc của mình." - Bố Shizuka', en: '"The happiness of others is also your own happiness." - Shizuka\'s Dad', ja: '"人の幸せを願い、人の不幸を悲しむことができる人。" - しずかのパパ' },
      { vi: '"Bạn bè là những người sẽ ở bên cậu lúc khó khăn nhất." - Gian', en: '"Friends are the ones who stay when things get tough." - Gian', ja: '"心の友よ！" - ジャイアン' },
      { vi: '"Nếu người khác làm được, cậu cũng làm được." - Doraemon', en: '"If others can do it, you can too." - Doraemon', ja: '"人にできて、きみだけにできないことなんてあるもんか。" - ドラえもん' },
      { vi: '"Dù chậm chạp, tớ vẫn sẽ cố gắng đi bằng chính đôi chân mình." - Nobita', en: '"Even if I am slow, I will walk with my own feet." - Nobita', ja: '"のんびり行こうよ、人生は。" - のび太' }
    ];

    function rotateQuotes() {
      statusNote.style.opacity = 0;
      setTimeout(() => {
        if (document.body.classList.contains('doraemon-mode')) {
            statusNote.innerText = doraQuotes[doraQuoteIndex][currentLang];
            doraQuoteIndex = (doraQuoteIndex + 1) % doraQuotes.length;
        } else {
            statusNote.innerText = quotes[quoteIndex][currentLang];
            quoteIndex = (quoteIndex + 1) % quotes.length;
        }
        statusNote.style.opacity = 1;
      }, 800); 
    }
    const translations = {
      vi: { 
        sub: "Tối giản | Thể thao | Đam mê công nghệ", status: "Trò chuyện cùng Peih AI (BETA)", disclaimer: "Đại diện kỹ thuật số – Không phải cá nhân thực.", 
        msg1: "Chào bạn! Mình là bản sao số thông minh của Peih.<br>Rất vui được kết nối!", msg2: "Bạn đang muốn hỏi Peih về thời gian, lịch trình hay kinh nghiệm?<br>Cứ gõ vào đây nhé!", 
        placeholder: "Hỏi Peih bất cứ điều gì...", connecting: "Đang kết nối...", cap1: "Gói ghém mùa hè vào những chuyến đi", cap2: "Ngày se lạnh và một góc ngồi yên", sendBtn: "GỬI",
        sleepMsg: "Peih AI đang đi ngủ 💤", sleepPlaceholder: "Hệ thống đang bảo trì...",
        sleepyMsg1: "Ơ... tự nhiên Peih AI thấy buồn ngủ quá 🥱", sleepyMsg2: "Mình xin phép đi chợp mắt một lát nha. Gặp lại bạn sau! 👋",
        offlineMsg: "Ối, Peih bị rớt mạng rồi! 📶 Bạn kiểm tra lại WiFi hoặc 4G giúp mình nha 🥺",
        timeoutMsg: "Đường truyền đang bị nghẽn hoặc máy chủ phản hồi quá chậm 🐢. Peih đã ngắt kết nối an toàn, bạn thử gửi lại nhé!",
        wakeBtn: "ĐÁNH THỨC", wakeUpCall: "Peih AI ơi, dậy đi nào! ⏰", stillSleepingMsg: "Nhỏ tiếng thôi... Peih AI vẫn đang ngủ khò khò 😴",
        awakeMsg: "Tada! Peih AI đã thức dậy và nạp đầy năng lượng rồi nè! ✨", sent: "Đã gửi", read: "Đã xem", spamWarning: "Từ từ thôi nè, mình đang đọc... 😅",
        fakeSleepStatus: "Peih AI đang lén ngủ gật 💤", fakeCloud1: "Peih lén ngủ... Chọc dậy đi! 🤫", fakeCloud2: "Nướng khét lẹt rồi, chọc mạnh nữa đi! ⏰", fakeHolder1: "Lấy nhánh cây chọc Peih AI...", fakeHolder2: "Hét lớn vào tai Peih AI...", fakeBtn1: "CHỌC DẬY", fakeBtn2: "GỌI TIẾP", 
        fakeRep1: "Ưm... cho chợp mắt 5 phút nữa thôi mờ 😪", fakeRep2: "Á giật cả mình! Dậy rồi dậy rồi, đang làm việc đây! 🏃‍♂️💨",
        fakePoke: "👉 *chọc chọc*", fakeYell: "📣 DẬY ĐI LÀM VIỆC NÀO!!!",
        fakeStartMsg: "Ưm... dạo này nhiều việc quá... khò khò 😪", dreams: ["💭 Mơ thấy đang ăn tô bún bò khổng lồ...", "💭 Ưm... chạy bộ trên máy mỏi chân quá...", "💭 Đang mải đánh boss Zelda trên Switch...", "💭 Chưa sáng mà... cho ngủ thêm 5 phút..."], emptySleepHint: "Suỵt... Peih AI đang chợp mắt",
        eggRecalled: "Peih AI đã xoá một tin nhắn",
        eggBlur: "Ối, Peih AI nay ra đường lười đeo kính nên nhìn mọi thứ mờ căm. Không nhận ra người quen luôn, bạn là ai thế? 😵‍💫 (Bấm đúp vào Avatar lần nữa để tháo kính ra nhé!)", 
        eggDart: "Bullseye! 🎯 Cú click chuẩn xác đấy. Dạo này tay ném phi tiêu lên trình quá, hôm nào làm một ván Darts không?", 
        eggZelda1: "Suỵt...", eggZelda2: "Đang kẹt đánh boss trong Tears of the Kingdom.", eggZelda3: "Chờ mình giải xong cái Shrine này rồi nạp năng lượng nói chuyện tiếp nhé! 🗡️🛡️", 
        eggSb1: "Đang order Trà chanh thêm một shot Espresso đúng không?", eggSb2: "Vị hơi dị nhưng mà cuốn phết...", eggSb3: "Đúng gu của Peih rồi đấy! 🥤✨",
        sbStatus: "CỬA HÀNG STARBUCKS RESERVE",
        musicInvite: "Không gian yên tĩnh quá, sếp có muốn nghe bản nhạc tôi tự sáng tác không? 🎧 (Bấm vào đây nhé)",
        songTitle: "Ngài Tạo Nên Con", songArtist: "Sáng tác: Peih Thật", musicStatus: "🎵 PEIH'S PLAYLIST",
        privacyIntro: "© 2026 Peih - Digital Twin<br>Nhấn vào tin nhắn dưới để mở chính sách:",
        btnPrivacy: "Chính sách Quyền riêng tư", btnTerms: "Điều khoản Sử dụng", btnLegal: "Pháp Lý", btnContact: "Liên Hệ", btnClose: "Kết thúc",
        footerText: "© 2026 Peih - Digital Twin<br>Quyền riêng tư | Điều khoản & Pháp lý | Liên hệ",
        toxicRecalled: "Tin nhắn vi phạm đã bị Peih thu hồi",
        logout1: "> Đang ngắt kết nối...", logout2: "> Đang tắt lõi M1 Pro...", logout3: "> Đang dọn dẹp bộ nhớ...", logout4: "> Hệ thống ngoại tuyến. Tạm biệt, Peih.",
        pocketTitle: "TÚI THẦN KỲ", pocketHint: "← Vuốt hoặc chạm để xem | Nhấn để dùng →",
        mapTitle: "📜 BẢN ĐỒ KHO BÁU",
        mapL1: "❌ Phù thủy luôn bắt đầu bằng dấu gạch chéo: <i>/zelda, /starbucks, /music, /play</i>.",
        mapL2: "🪞 Chạm hai lần vào gương thần (Avatar) để thấy sự mờ ảo.",
        mapL3: "🔴 Sức sống của Peih nằm ở đốm sáng trạng thái. Hãy chọc nó 3 lần!",
        mapL4: "🤧 Nơi cất giấu tật xấu nằm ở một bức ảnh se lạnh. Hãy thử chạm đúp vào nó.",
        mapHint: "(Chạm vào bất kỳ đâu để đốt bản đồ)",
        doorTitle: "Nơi bạn muốn đến?", tvOff: "TẮT", breadTitle: "Chọn Ngôn Ngữ", tmClose: "❌ Trở về Hiện Tại",
        bookTitle: "Cuốn Sổ Định Mệnh", bookNameHold: "Tên của bạn là gì?", bookNoteHold: "Để lại lời nhắn cho Peih...", bookSubmit: "GHI VÀO SỔ ✍️",
        tinCanTitle: "Đường Dây Nóng tới Peih",
        pencilPrompt: "Hãy kể cho mình nghe về dự án hoặc trải nghiệm thú vị nhất mà Peih từng làm đi!",
        truthPepperDefault: "Thực ra Peih rất hoàn hảo, chả có tật xấu nào cả! 🤥", truthPepperAction: "🤧 Hắt xìiii!!!\nOops... hình như có ai rắc tiêu. Sẵn tiện lỡ mồm thì nói luôn: {habit}",
        pillTitle: "Chọn Nhân Cách Mới", pillLoading: "Đang mở lọ thuốc...", pillEmpty: "Hết thuốc rồi! Đi mua đã 🏃‍♂️", pillReset: "Trở lại bình thường",
        pillCured: "Đã uống thuốc Giải Độc 🧪. Peih AI đã trở lại bình thường!", pillTaken: "💊 Vừa uống thuốc [{pill}].\nKể từ giờ tớ sẽ đổi nhân cách theo thuốc này nhé!",
        doraDoorOpenPlaceholder: "Nhập tin nhắn cho Doraemon...", doraDoorOpenMsg: "Cánh cửa thần kỳ đã mở! Cậu cần bảo bối gì?",
        doraWarning: "Hả? \nCậu đang du hành tới tương lai qua Cánh cửa thần kỳ mà!\nMấy món đó chỉ dùng được ở thế kỷ 21 thôi.\nQuay về hiện tại đi rồi tớ mới lấy ra được! 🛎️✨",
        bookAlert: "Vui lòng điền đủ Tên, Ngày và Giờ nhé!", bookSuccess: "Đã ghi vào Sổ Định Mệnh! 🗓️\nPeih sẽ xuất hiện gặp {name} vào lúc {time} ngày {date} nhé!",
        clearChatConfirm: "Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện này không?",
        cssBread: "Bánh mì chuyển ngữ",
        baoBoi_trans_bread: "Bánh mì phiên dịch", baoBoi_time_machine: "Cỗ máy thời gian", baoBoi_anywhere_door: "Cửa thần kỳ", baoBoi_computer_pencil: "Bút máy tính", baoBoi_dressup_camera: "Máy ảnh tạo mốt", baoBoi_time_kerchief: "Khăn thời gian", baoBoi_dream_tv: "Tivi mộng mơ", baoBoi_booking_diary: "Sổ đặt lịch", baoBoi_personality_pill: "Thuốc tính cách", baoBoi_truth_pepper: "Tiêu nói thật", baoBoi_tin_can_phone: "Điện thoại ống bơ", baoBoi_treasure_map: "Bản đồ kho báu",
        tm_year0: "Lần đầu tiên học code...", tm_year1: "Chạy deadline sấp mặt 🥲", tm_year2: "Làm việc tại quán cafe quen", tm_year3: "Tạo ra Digital Twin này! ✨",
        tinCanHeader: "☎️ ĐANG NỐI MÁY VỚI HOÀ HIỆP", tinCanDivider: "🥫———— ĐƯỜNG DÂY ĐÃ KẾT NỐI ————🥫", tinCanEnd: "✂️ Đã cắt dây. Quay lại Peih.", btnEndCall: "CẮT DÂY", tinCanPlaceholder: "Nhắn trực tiếp cho Hoà Hiệp...", placeholderWithName: "{name} cứ hỏi Peih nha...",
        threadTitle: "Dòng thời gian", threadLoading: "Đang tải dòng thời gian...", threadEmpty: "Chưa có dòng thời gian nào.", threadError: "Mạng lag, không tải được dòng thời gian rồi! 🐢", threadPinned: "Đã ghim", threadCommentPlaceholder: "Viết bình luận...", threadSendBtn: "Gửi", threadBackBtn: "Trở lại",
        syncingData: "Đang đồng bộ dữ liệu...", disconnected: "Đã ngắt kết nối...",reconnecting: "Đã có mạng, đang kết nối lại...", reconnectFailed: "Vẫn chưa kết nối được máy chủ...", secretTooltip: "Chat với Peih AI, hoặc gõ @ để gửi tin ẩn danh cho Hòa Hiệp.", secretPlaceholder: "Gửi ẩn danh cho Hòa Hiệp...", secretSuccess: "Xong! Mình vừa chuyển lời nhắn của bạn cho 'sếp' Hòa Hiệp rồi. Bí mật này chỉ hai người biết thôi nhé!", maintStatus: "HỆ THỐNG ĐANG BẢO TRÌ ⚙️", maintPlaceholder: "Đang nâng cấp lõi M1 Pro...", maintHint: "Đang dọn dẹp và cập nhật dữ liệu...", threadLoadingMore: "Đang tải thêm bài cũ...", threadEndOfFeed: "Bạn đã xem hết dòng thời gian."
      },
      ja: { 
        sub: "ミニマリスト | スポーツ | テック愛好家", status: "Peih AI とチャット (BETA)", disclaimer: "デジタル表現 – 本人ではありません。", 
        msg1: "こんにちは！Peihのインテリジェントなデジタルツインです。<br>よろしくお願いします！", msg2: "Peihのスケジュールや経験について質問がありますか？<br>ここに書いてください！", 
        placeholder: "何でも聞いてください...", connecting: "接続中...", cap1: "夏を旅の思い出に", cap2: "肌寒い日と静かなコーナー", sendBtn: "送信",
        sleepMsg: "Peih AIはおやすみ中です 💤", sleepPlaceholder: "システムメンテナンス中...",
        sleepyMsg1: "ふわぁ… なんだか急に眠くなってきました 🥱", sleepyMsg2: "Peih AIは少しお昼寝しますね。また後で！ 👋",
        offlineMsg: "あれっ、ネットが切れちゃいました！📶 Wi-Fiか4Gを確認してもらえませんか？🥺",
        timeoutMsg: "通信が混雑しているか、サーバーの応答が遅すぎます 🐢。安全のために接続を切断しました。もう一度送信してみてください！",
        wakeBtn: "起こす", wakeUpCall: "Peih AI、起きて！ ⏰", stillSleepingMsg: "しーっ… Peih AIはまだ夢の中です 😴",
        awakeMsg: "じゃーん！Peih AIが目覚めました！✨", sent: "送信済み", read: "既読", spamWarning: "ちょっと待って、読んでます... 😅",
        fakeSleepStatus: "Peih AIはこっそり昼寝中 💤", fakeCloud1: "こっそり寝てる... つつこう！🤫", fakeCloud2: "まだ寝てる！もう一回強く呼んで！⏰", fakeHolder1: "棒でつつく...", fakeHolder2: "耳元で叫ぶ...", fakeBtn1: "つつく", fakeBtn2: "叫ぶ", 
        fakeRep1: "んん…あと5分だけ寝かせて… 😪", fakeRep2: "うわっ！起きた起きた！もうやめて、仕事するから！🏃‍♂️💨",
        fakePoke: "👉 *ツンツン*", fakeYell: "📣 起きて仕事して!!!",
        fakeStartMsg: "ふぅ... 最近忙しすぎるよ... ぐーぐー 😪", dreams: ["💭 巨大なラーメンを食べてる夢...", "💭 ランニングマシン疲れちゃった...", "💭 スイッチでゼルダやってる...", "💭 まだ夜だよ... あと5分..."], emptySleepHint: "しーっ… 昼寝中ですよ",
        eggRecalled: "Peih AI がメッセージを削除しました",
        eggBlur: "あれっ、今日はメガネを忘れて全部ぼやけて見える。誰ですか？😵‍💫（もう一度アバターをダブルクリックしてメガネを外して！）", 
        eggDart: "ブルズアイ！🎯 正確なクリックだね。最近ダーツの腕が上がったんだ、今度一緒にやらない？", 
        eggZelda1: "しーっ…", eggZelda2: "ティアキンのボス戦で詰まってるんだ。", eggZelda3: "この祠をクリアしたら話そう！🗡️🛡️", 
        eggSb1: "エスプレッソショット追加のレモンティー？", eggSb2: "ちょっと変わってるけど...", eggSb3: "Peihの好みだね！🥤✨",
        sbStatus: "スターバックス リザーブ ロースタリー",
        musicInvite: "静かですね。私が作曲した曲を聴いてみませんか？ 🎧 (ここをクリック)", 
        songTitle: "Ngai Tao Nen Con", songArtist: "作曲: Peih", musicStatus: "🎵 PEIH'S PLAYLIST",
        privacyIntro: "© 2026 Peih - Digital Twin<br>下のメッセージをクリックしてポリシーを開きます:",
        btnPrivacy: "プライバシーポリシー", btnTerms: "利用規約", btnLegal: "法的情報", btnContact: "お問い合わせ", btnClose: "終了",
        footerText: "© 2026 Peih - Digital Twin<br>プライバシーポリシー | 利用規約・法的事項 | お問い合わせ",
        toxicRecalled: "違反メッセージはPeihによって削除されました",
        logout1: "> 接続を切断しています...", logout2: "> M1 Proコアをシャットダウンしています...", logout3: "> メモリをクリアしています...", logout4: "> システムオフライン。さようなら、Peih。",
        pocketTitle: "四次元ポケット", pocketHint: "← スワイプまたはタップで表示 | クリックで使用 →",
        mapTitle: "📜 宝の地図",
        mapL1: "❌ 魔法は常にスラッシュから始まります：<i>/zelda, /starbucks, /music, /play</i>.",
        mapL2: "🪞 魔法の鏡（アバター）をダブルタップすると、ぼやけが見えます。",
        mapL3: "🔴 Peihの生命力はステータスドットにあります。3回つつこう！",
        mapL4: "🤧 悪い癖は肌寒い写真に隠されています。ダブルタップしてみて。",
        mapHint: "(どこかをタップして地図を燃やす)",
        doorTitle: "どこに行きたい？", tvOff: "オフ", breadTitle: "言語を選択", tmClose: "❌ 現在に戻る",
        bookTitle: "運命のメモ帳", bookNameHold: "お名前は？", bookNoteHold: "Peihへのメッセージを残す...", bookSubmit: "日記に書く ✍️",
        tinCanTitle: "Peihへのホットライン", 
        pencilPrompt: "Peihがこれまでにやった最も面白いプロジェクトや経験について教えて！",
        truthPepperDefault: "実はPeihは完璧で、悪い癖は全くないんだ！🤥", truthPepperAction: "🤧 ハクション！！！\nおっと... 誰かがコショウをふりかけたみたい。口が滑ったついでに言っちゃうね：{habit}",
        pillTitle: "新しい性格を選ぶ", pillLoading: "薬瓶を開けています...", pillEmpty: "薬がなくなった！買いに行かなきゃ 🏃‍♂️", pillReset: "通常に戻る",
        pillCured: "解毒剤を飲みました 🧪。Peih AIは通常に戻りました！", pillTaken: "💊 [{pill}] を飲みました。\nこれからはこの薬に合わせて性格を変えるね！",
        doraDoorOpenPlaceholder: "ドラえもんへのメッセージ...", doraDoorOpenMsg: "どこでもドアが開いたよ！どの秘密道具が必要？",
        doraWarning: "ええっ？\nどこでもドアで未来に来てるんだよ！\nその道具は21世紀でしか使えないんだ。\n元の世界に戻ったら、また出してあげるよ！🛎️✨",
        bookAlert: "名前、日付、時間をすべて入力してください！", bookSuccess: "運命のメモ帳に記録しました！🗓️\nPeihは {date} の {time} に {name} に会いに行きます！",
        clearChatConfirm: "この会話をすべて削除してもよろしいですか？",
        cssBread: "ほんやくコンニャク",
        baoBoi_trans_bread: "ほんやくコンニャク", baoBoi_time_machine: "タイムマシン", baoBoi_anywhere_door: "どこでもドア", baoBoi_computer_pencil: "コンピューターペンシル", baoBoi_dressup_camera: "着せ替えカメラ", baoBoi_time_kerchief: "タイムふろしき", baoBoi_dream_tv: "夢テレビ", baoBoi_booking_diary: "予定メモ帳", baoBoi_personality_pill: "性格カプセル", baoBoi_truth_pepper: "コエカタマリン", baoBoi_tin_can_phone: "糸電話", baoBoi_treasure_map: "宝探し地図",
        tm_year0: "初めてコードを学んだ時...", tm_year1: "締め切りに追われる日々 🥲", tm_year2: "おなじみのカフェで作業", tm_year3: "このデジタルツインを作成した！✨",
        tinCanHeader: "☎️ ホア・ヒエップに接続中", tinCanDivider: "🥫———— 糸電話が繋がりました ————🥫", tinCanEnd: "✂️ 通話終了。Peihに戻ります。", btnEndCall: "糸を切る", tinCanPlaceholder: "ホア・ヒエップに直接メッセージ...", placeholderWithName: "{name}さん、何でも聞いて...",
        threadTitle: "タイムライン", threadLoading: "タイムラインを読み込み中...", threadEmpty: "タイムラインがありません。", threadError: "ネットワーク遅延、読み込めませんでした！ 🐢", threadPinned: "固定済み", threadCommentPlaceholder: "コメントを書く...", threadSendBtn: "送信",threadBackBtn: "戻る",syncingData: "データを同期中...", disconnected: "切断されました...", reconnecting: "ネットワーク復旧、再接続中...", reconnectFailed: "サーバーに接続できません...", secretTooltip: "Peih AI とチャットするか、@ を入力してホア・ヒエップに匿名送信します。", secretPlaceholder: "ホア・ヒエップに匿名で送信...", secretSuccess: "完了！「ボス」のホア・ヒエップにメッセージを転送しました。これは二人だけの秘密ですよ！", maintStatus: "システムメンテナンス中 ⚙️",
        maintPlaceholder: "M1 Proコアをアップグレード中...", maintHint: "システムデータを更新中...", threadLoadingMore: "古い投稿を読み込み中...", threadEndOfFeed: "タイムラインの最後まで閲覧しました。"
      },
      en: { 
        sub: "Minimalist | Sports | Tech Enthusiast", status: "Chat with Peih AI (BETA)", disclaimer: "Digital Representation – Not the physical individual.", 
        msg1: "Hi! I am Peih's intelligent digital twin.<br>Nice to meet you!", msg2: "Are you asking about Peih's schedule, time, or experience?<br>Just type it here!", 
        placeholder: "Ask Peih anything...", connecting: "Connecting...", cap1: "Packing summer into journeys", cap2: "Chilly day and a quiet corner", sendBtn: "SEND",
        sleepMsg: "Peih AI is sleeping 💤", sleepPlaceholder: "System under maintenance...",
        sleepyMsg1: "Yawn... Peih AI is suddenly feeling very sleepy 🥱", sleepyMsg2: "I'm going to take a quick nap. Catch you later! 👋",
        offlineMsg: "Oops, Peih lost connection! 📶 Could you please check your WiFi or cellular data? 🥺",
        timeoutMsg: "The connection is unstable or the server is responding too slowly 🐢. Peih has safely disconnected, please try sending again!",
        wakeBtn: "WAKE UP", wakeUpCall: "Wake up, Peih AI! ⏰", stillSleepingMsg: "Shh... Peih AI is still fast asleep 😴",
        awakeMsg: "Tada! Peih AI is awake and fully charged! ✨", sent: "Sent", read: "Read", spamWarning: "Hold on, let me read... 😅",
        fakeSleepStatus: "Peih AI is taking a sneaky nap 💤", fakeCloud1: "Peih is napping... Poke to wake! 🤫", fakeCloud2: "Still asleep! Call louder! ⏰", fakeHolder1: "Poke Peih AI with a stick...", fakeHolder2: "Yell into ear...", fakeBtn1: "POKE", fakeBtn2: "YELL", 
        fakeRep1: "Mmm... just 5 more minutes please... 😪", fakeRep2: "Ah! I'm awake! Stop poking, I'm working! 🏃‍♂️💨",
        fakePoke: "👉 *poke poke*", fakeYell: "📣 WAKE UP AND WORK!!!",
        fakeStartMsg: "Mmm... too much work lately... Zzz 😪", dreams: ["💭 Dreaming of a big bowl of Pho...", "💭 Running machine is tiring...", "💭 Playing Zelda on Switch...", "💭 Not morning yet... 5 more mins..."], emptySleepHint: "Shh... Peih AI is napping",
        eggRecalled: "Peih AI deleted a message",
        eggBlur: "Oops, I didn't wear my glasses today, everything is blurry. Who are you? 😵‍💫 (Double click Avatar again to take them off!)", 
        eggDart: "Bullseye! 🎯 Precise click. My darts skills are improving, wanna play a game soon?", 
        eggZelda1: "Shh...", eggZelda2: "Stuck at a boss in Tears of the Kingdom.", eggZelda3: "Let me finish this Shrine first! 🗡️🛡️", 
        eggSb1: "Ordering Lemon Tea with an Espresso shot, right?", eggSb2: "A bit weird but...", eggSb3: "Totally Peih's style! 🥤✨",
        sbStatus: "STARBUCKS RESERVE STORE",
        musicInvite: "It's so quiet. Wanna hear a song I composed? 🎧 (Click here)", 
        songTitle: "Ngai Tao Nen Con", songArtist: "By: Real Peih", musicStatus: "🎵 PEIH'S PLAYLIST",
        privacyIntro: "© 2026 Peih - Digital Twin<br>Click the messages below to open the policy:",
        btnPrivacy: "Privacy Policy", btnTerms: "Terms of Service", btnLegal: "Legal", btnContact: "Contact", btnClose: "End",
        footerText: "© 2026 Peih - Digital Twin<br>Privacy Policy | Terms & Legal | Contact",
        toxicRecalled: "Violating message has been recalled by Peih",
        logout1: "> Shutting down connections...", logout2: "> Disconnecting M1 Pro Core...", logout3: "> Clearing cache & memory...", logout4: "> System Offline. Goodbye, Peih.",
        pocketTitle: "FOUR-DIMENSIONAL POCKET", pocketHint: "← Swipe or tap to view | Click to use →",
        mapTitle: "📜 TREASURE MAP",
        mapL1: "❌ Spells always start with a slash: <i>/zelda, /starbucks, /music, /play</i>.",
        mapL2: "🪞 Double tap the magic mirror (Avatar) to see the blurriness.",
        mapL3: "🔴 Peih's life force lies in the status dot. Poke it 3 times!",
        mapL4: "🤧 The bad habit is hidden in a chilly photo. Try double-tapping it.",
        mapHint: "(Tap anywhere to burn the map)",
        doorTitle: "Where do you want to go?", tvOff: "OFF", breadTitle: "Select Language", tmClose: "❌ Return to Present",
        bookTitle: "The Destiny Diary", bookNameHold: "What is your name?", bookNoteHold: "Leave a message for Peih...", bookSubmit: "WRITE IN DIARY ✍️",
        tinCanTitle: "Hotline to Peih", 
        pencilPrompt: "Tell me about the most interesting project or experience Peih has ever done!",
        truthPepperDefault: "Actually, Peih is perfect, no bad habits at all! 🤥", truthPepperAction: "🤧 Achoo!!!\nOops... looks like someone sprinkled pepper. Since I slipped my tongue, I'll say it: {habit}",
        pillTitle: "Choose New Personality", pillLoading: "Opening pill bottle...", pillEmpty: "Out of pills! Need to buy more 🏃‍♂️", pillReset: "Back to normal",
        pillCured: "Took Antidote 🧪. Peih AI is back to normal!", pillTaken: "💊 Just took [{pill}].\nFrom now on I'll change my personality according to this pill!",
        doraDoorOpenPlaceholder: "Type message for Doraemon...", doraDoorOpenMsg: "Anywhere door opened! What gadget do you need?",
        doraWarning: "Wait! \nYou're traveling to the future through the Anywhere Door!\nThose items only work in the 21st century.\nGo back to the present and I'll get them for you! 🛎️✨",
        bookAlert: "Please fill in Name, Date and Time!", bookSuccess: "Written in Destiny Diary! 🗓️\nPeih will appear to meet {name} at {time} on {date}!",
        clearChatConfirm: "Are you sure you want to clear this conversation?",
        cssBread: "Translation Bread",
        baoBoi_trans_bread: "Translation Bread", baoBoi_time_machine: "Time Machine", baoBoi_anywhere_door: "Anywhere Door", baoBoi_computer_pencil: "Computer Pencil", baoBoi_dressup_camera: "Dress-up Camera", baoBoi_time_kerchief: "Time Kerchief", baoBoi_dream_tv: "Dream TV", baoBoi_booking_diary: "Booking Diary", baoBoi_personality_pill: "Personality Pill", baoBoi_truth_pepper: "Truth Pepper", baoBoi_tin_can_phone: "Tin Can Phone", baoBoi_treasure_map: "Treasure Map",
        tm_year0: "Learning to code for the first time...", tm_year1: "Struggling with deadlines 🥲", tm_year2: "Working at the familiar cafe", tm_year3: "Created this Digital Twin! ✨",
        tinCanHeader: "☎️ CONNECTED TO HOA HIEP", tinCanDivider: "🥫———— STRING CONNECTED ————🥫", tinCanEnd: "✂️ Call ended. Back to Peih.", btnEndCall: "CUT WIRE", tinCanPlaceholder: "Message Hoa Hiep directly...", placeholderWithName: "{name}, ask Peih anything...",
        threadTitle: "Timeline", threadLoading: "Loading timeline...", threadEmpty: "No timeline available.", threadError: "Network lag, couldn't load timeline! 🐢", threadPinned: "Pinned", threadCommentPlaceholder: "Write a comment...", threadSendBtn: "Send",threadBackBtn: "Back", syncingData: "Syncing data...", disconnected: "Disconnected...", reconnecting: "Network restored, reconnecting...", reconnectFailed: "Still unable to connect to server...", secretTooltip: "Chat with Peih AI, or type @ to secretly message Hoa Hiep.", secretPlaceholder: "Secretly message Hoa Hiep...", secretSuccess: "Done! I've forwarded your message to 'boss' Hoa Hiep. It's our little secret!", maintStatus: "SYSTEM MAINTENANCE ⚙️", maintPlaceholder: "Upgrading M1 Pro core...",maintHint: "Updating system data...", threadLoadingMore: "Loading older posts...", threadEndOfFeed: "You have reached the end of the timeline."
      }
    };
/* ================= PRIVACY & LEGAL LOGIC ================= */
    let activePrivacyMenus = []; 
    let activePrivacyContents = {}; 
    let introPrivacyId = null;
    let isPrivacyLocked = false; 

    function removeBubbleCompletely(id) {
        let el = document.getElementById(id);
        if (el && el.parentElement) el.parentElement.remove();
    }
    function appendPrivacyTyping(id) {
        const html = `
        <div class="flex items-end gap-1.5 w-full mb-1 mt-4">
            <img src="${getAvatarUrl()}" class="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm" alt="Peih">
            <div id="${id}" class="msg-bubble rounded-[24px] px-4 py-3 flex gap-1 items-center shadow-sm h-[38px]" style="background-color: var(--bot-msg-bg); border: 1px solid var(--glass-border);">
                <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
            </div>
        </div>`;
        chatBox.insertAdjacentHTML('beforeend', html);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function triggerPrivacyMenu() {
        if(isAppSleeping || isFakeSleeping) return;
        if (activePrivacyMenus.length > 0) {
            chatBox.scrollTop = chatBox.scrollHeight;
            return;
        }

        if(isPrivacyLocked) return;
        isPrivacyLocked = true;
        setTimeout(() => isPrivacyLocked = false, 5000); 

        await showTypingIndicator(800, false);
        const groupId = 'priv-' + Date.now();
        if (!introPrivacyId) {
            introPrivacyId = groupId + '-intro';
            appendPrivacyBotMsg(translations[currentLang].privacyIntro, introPrivacyId, true);
        }
        
        showPrivacyOptions(groupId);
    }
    function showPrivacyOptions(groupId) {
        const opts = [
            { id: groupId + '-btn1', text: "🛡️ " + translations[currentLang].btnPrivacy, action: "fetchAndShowPolicy('privacy')" },
            { id: groupId + '-btn2', text: "📄 " + translations[currentLang].btnTerms, action: "fetchAndShowPolicy('terms')" },
            { id: groupId + '-btn3', text: "⚖️ " + translations[currentLang].btnLegal, action: "fetchAndShowPolicy('legal')" },
            { id: groupId + '-btn4', text: "📞 " + translations[currentLang].btnContact, action: "fetchAndShowPolicy('contact')" },
            { id: groupId + '-btn5', text: "❌ " + translations[currentLang].btnClose, action: "closePrivacyMenu()", textColor: "#ef4444" } 
        ];
        
        opts.forEach(opt => {
            activePrivacyMenus.push(opt.id);
            const html = `
            <div class="flex items-end gap-1.5 w-full mb-1">
                <div class="w-8 h-8 shrink-0 relative"></div>
                <div id="${opt.id}" class="msg-bubble rounded-[24px] invite-bubble" onclick="${opt.action}" style="background-color: var(--bot-msg-bg); color: ${opt.textColor || 'var(--bot-msg-text)'}; border: 1px solid var(--glass-border); cursor: pointer; font-weight: ${opt.textColor ? '600' : '400'};">
                    ${opt.text}
                </div>
            </div>`;
            chatBox.insertAdjacentHTML('beforeend', html);
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendPrivacyBotMsg(text, id, withAvatar = false) {
        const avatarHtml = withAvatar ? `<img src="${getAvatarUrl()}" class="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm" alt="Peih">` : `<div class="w-8 h-8 shrink-0 relative"></div>`;
        const html = `
        <div class="flex items-end gap-1.5 w-full mb-1 mt-4">
            ${avatarHtml}
            <div id="${id}" class="msg-bubble rounded-[24px]" style="background-color: var(--bot-msg-bg); color: var(--bot-msg-text); border: 1px solid var(--glass-border);">
                ${text}
            </div>
        </div>`;
        chatBox.insertAdjacentHTML('beforeend', html);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function fetchAndShowPolicy(type) {
        activePrivacyMenus.forEach(removeBubbleCompletely);
        activePrivacyMenus = [];
        Object.values(activePrivacyContents).forEach(removeBubbleCompletely);
        activePrivacyContents = {};

        const loadingId = 'priv-load-' + Date.now();
        appendPrivacyTyping(loadingId);

        google.script.run.withSuccessHandler(function(content) {
            removeBubbleCompletely(loadingId);
            
            const contentId = 'priv-content-' + Date.now();
            activePrivacyContents[type] = contentId; 
            appendPrivacyBotMsg(content.replace(/\n/g, '<br>'), contentId, true);
            
            const groupId = 'priv-' + Date.now();
            showPrivacyOptions(groupId);
        }).getPrivacyContent(type, currentLang);
    }

    function closePrivacyMenu() {
        activePrivacyMenus.forEach(removeBubbleCompletely);
        activePrivacyMenus = [];
        Object.values(activePrivacyContents).forEach(removeBubbleCompletely);
        activePrivacyContents = {};
        if(introPrivacyId) { 
            recallSpecificBubble(introPrivacyId); 
            introPrivacyId = null; 
        }
    }

    function recallSpecificBubble(id) {
        let el = document.getElementById(id);
        if (el) {
            el.innerText = translations[currentLang].eggRecalled;
            el.className = 'msg-recalled';
            el.style.opacity = '1';
            let avatar = el.parentElement.querySelector('img, .shrink-0');
            if (avatar) avatar.remove();
        }
    }
    /* ================= EASTER EGGS LOGIC ================= */

function isBotBusy() {
    const wrapper = document.getElementById('main-chat-wrapper');
    return isAppSleeping || 
           isFakeSleeping || 
           autoChatActive || 
           isHotlineMode || 
           uiState.isSneezing || 
           (wrapper && (wrapper.classList.contains('zelda-mode') || 
                        wrapper.classList.contains('starbucks-mode') || 
                        wrapper.classList.contains('music-mode'))) || 
           (document.getElementById('logout-overlay') && document.getElementById('logout-overlay').classList.contains('active'));
}

function resetAllVisuals() {
    clearVisualModes(false);
    activeEggTimeouts.forEach(clearTimeout);
    activeEggTimeouts = [];
    if (uiState.isBlurry) {
        document.body.classList.remove('blur-mode');
        Array.from(chatBox.children).forEach(child => child.classList.remove('blurry-msg'));
        uiState.isBlurry = false; 
    }
    uiState.isDartCooldown = false;
    const dartIcon = document.getElementById('dart-icon');
    if (dartIcon) dartIcon.classList.remove('dart-throw');
    if (statusDot) statusDot.classList.remove('dart-shake');
    uiState.isSneezing = false;
    inputField.disabled = false;
    sendBtn.disabled = false;
}
    /* ================= POCKET CAROUSEL DATA ================= */
    // 1. DANH SÁCH 12 BẢO BỐI
    const baoBoiList = [
        { id: 'trans_bread', img: 'https://lh3.googleusercontent.com/u/0/d/1MB2wSrRoswhKNk9aP0yhWalz_Vv6GC-S' },
        { id: 'anywhere_door', img: 'https://lh3.googleusercontent.com/u/0/d/13Rvdf7nTEO-Ku7Qcz6DyqahcOpfcR1Rm' },
        { id: 'computer_pencil', img: 'https://lh3.googleusercontent.com/u/0/d/17HanchZGJ-VlzpKbfo76GSAP_91XdpU3' },
        { id: 'dressup_camera', img: 'https://lh3.googleusercontent.com/u/0/d/1O0VKJSdY5gRGgVhk8POZwg3ALqDHmWOj' },
        { id: 'time_kerchief', img: 'https://lh3.googleusercontent.com/u/0/d/1z_Lif56mS8aqvEw87bySAecvnuqVyVf2' },
        { id: 'dream_tv', img: 'https://lh3.googleusercontent.com/u/0/d/1BRyzfI-tFJ9TZ5JwG21Ujl_9NPwAY-6-' },
        { id: 'booking_diary', img: 'https://lh3.googleusercontent.com/u/0/d/1uFCXa8I4ne_zxoea2VQehkCG1tBsqnDn' },
        { id: 'personality_pill', img: 'https://lh3.googleusercontent.com/u/0/d/1s3bA-zsiDuRZo4SiO4yzQyVl3UFFIjoT' },
        { id: 'truth_pepper', img: 'https://lh3.googleusercontent.com/u/0/d/11xa4TFPncoQx0kDi4QH1wTpylJLQGoiu' },
        { id: 'tin_can_phone', img: 'https://lh3.googleusercontent.com/u/0/d/1zge9caKP7io2geRJg9o3UzOk8gcZEMUa' },
        { id: 'treasure_map', img: 'https://lh3.googleusercontent.com/u/0/d/1rohiU8pr0HDi2Ijg3xDpBlhQtC46a3ji' }
    ];
/* ================= POCKET CAROUSEL - CƠ CHẾ CHẠM ================= */
    let isPocketOpen = false;
    let currentX = 0;
    const CARD_WIDTH = 240; // Độ rộng thẻ (220) + Gap (20)
    let pocketParticleTimer;

    function spawnGadgetParticle() {
        const overlay = document.getElementById('bao-boi-overlay');
        if (!overlay || !overlay.classList.contains('open')) return;
        if (overlay.querySelectorAll('.gadget-particle').length > 15) return;
        const gadgets = ['🚁', '🚪', '🍞', '💊', '📸', '⏱️', '🔦', '📺', '🌶️', '🥫', '🗺️', '✏️', '📖', '🔔'];
        const el = document.createElement('div');
        el.className = 'gadget-particle';
        el.innerText = gadgets[Math.floor(Math.random() * gadgets.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = 200 + Math.random() * 400; 
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rot = (Math.random() - 0.5) * 720; 
        const duration = 1.5 + Math.random() * 1.5; 
        el.style.setProperty('--tx', `${tx}px`);
        el.style.setProperty('--ty', `${ty}px`);
        el.style.setProperty('--rot', `${rot}deg`);
        el.style.setProperty('--duration', `${duration}s`);
        const content = document.getElementById('pocket-content');
        overlay.insertBefore(el, content);
        setTimeout(() => {
            if (el.parentNode) el.remove();
        }, duration * 1000);
    }

    function togglePocket() {
        const overlay = document.getElementById('bao-boi-overlay');
        const vortex = document.getElementById('pocket-vortex');
        const content = document.getElementById('pocket-content');
        
        isPocketOpen = !isPocketOpen;
        if (isPocketOpen) {
            document.body.classList.add('pocket-open');
            document.documentElement.classList.add('pocket-open');
            overlay.style.display = 'flex';
            
            setTimeout(() => { 
                overlay.classList.add('open'); 
                vortex.classList.remove('vortex-spin-out');
                vortex.classList.add('vortex-spin-in');
                content.style.opacity = '1';
                clearInterval(pocketParticleTimer);
                pocketParticleTimer = setInterval(spawnGadgetParticle, 150);
                renderCarousel(); 
            }, 10);
        } else {
            overlay.classList.remove('open');
            clearInterval(pocketParticleTimer);
            vortex.classList.remove('vortex-spin-in');
            vortex.classList.add('vortex-spin-out');
            content.style.opacity = '0';
            setTimeout(() => { 
                overlay.style.display = 'none'; 
                document.body.classList.remove('pocket-open');
                document.documentElement.classList.remove('pocket-open');
                const particles = document.querySelectorAll('.gadget-particle');
                particles.forEach(p => p.remove());
            }, 600);
        }
    }

    function handleOverlayClick(e) {
        const clickedId = e.target.id;
        if (clickedId === 'bao-boi-overlay' || clickedId === 'pocket-vortex' || clickedId === 'pocket-content' || clickedId === 'carousel-viewport') {
            if (isPocketOpen) {
                togglePocket();
            }
        }
    }

    function renderCarousel() {
    const list = document.getElementById('carousel-list');
    if (!list) return;
    list.innerHTML = '';

    baoBoiList.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'carousel-item';
        card.innerHTML = `<img src="${item.img}" alt="img"><h3>${translations[currentLang]['baoBoi_' + item.id]}</h3>`;

        card.onclick = (e) => {
            e.stopPropagation();
            if (card.classList.contains('active')) {
                selectBaoBoi(item.id); 
            } else {
                const viewport = document.getElementById('carousel-viewport');
                viewport.scrollTo({
                    left: card.offsetLeft - (viewport.clientWidth / 2) + (card.clientWidth / 2),
                    behavior: 'smooth'
                });
            }
        };
        list.appendChild(card);
    });

    const viewport = document.getElementById('carousel-viewport');
    viewport.addEventListener('scroll', updateActiveCard);
    setTimeout(updateActiveCard, 50);
}

function updateActiveCard() {
    const viewport = document.getElementById('carousel-viewport');
    if (!viewport) return;
    
    const viewportCenter = window.innerWidth / 2;
    const items = document.querySelectorAll('.carousel-item');
    
    let minDistance = Infinity;
    let activeIndex = 0;

    items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(viewportCenter - itemCenter);
        
        if (distance < minDistance) {
            minDistance = distance;
            activeIndex = i;
        }
    });

    items.forEach((item, i) => {
        if (i === activeIndex) item.classList.add('active');
        else item.classList.remove('active');
    });
}

    function createSparkles() {
        const btn = document.getElementById('nut-vang-than-ky');
        if(!btn) return;
        btn.innerHTML = ''; 
        for(let i=0; i<6; i++) {
            let s = document.createElement('div');
            s.className = 'sparkle';
            let size = Math.random() * 4 + 2; 
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            s.style.left = (Math.random() * 70 + 15) + '%';
            s.style.top = (Math.random() * 70 + 15) + '%';
            s.style.animationDelay = (Math.random() * 1.5) + 's';
            btn.appendChild(s);
        }
    }

    function selectBaoBoi(id) {
        togglePocket(); // Đã đổi từ closeBaoBoiCarousel sang togglePocket
        const inputEl = document.getElementById('user-input');
        
        switch(id) {
            case 'computer_pencil':
                inputEl.value = '';
                const prompt = translations[currentLang].pencilPrompt;
                let i = 0; inputEl.focus();
                const typeWriter = setInterval(() => {
                    inputEl.value += prompt.charAt(i); i++;
                    if (i > prompt.length - 1) {
                        clearInterval(typeWriter);
                        inputEl.parentElement.style.transform = "translateY(5px)";
                        setTimeout(() => inputEl.parentElement.style.transform = "none", 200);
                    }
                }, 40);
                break;

            case 'dressup_camera':
                const flash = document.getElementById('camera-flash');
                flash.classList.add('flash');
                
                const shutter = new Audio('https://files.catbox.moe/u6c54o.mp3');
                shutter.play().catch(e=>{});

                setTimeout(() => {
                    document.body.classList.toggle('dressup-dark');
                    flash.classList.remove('flash');
                }, 400); 
                break;

            case 'time_kerchief':

                if(autoChatActive || isAppSleeping || isFakeSleeping) return;
                const kerchief = document.getElementById('time-kerchief-overlay');
                kerchief.classList.add('drop'); 
                
                setTimeout(() => {
                
                    chatBox.innerHTML = ''; 
                    eggMessageIds = []; 
                    chatContextHistory = []; 
                    localStorage.removeItem('peih_context_' + currentSessionId);
                    kerchief.classList.remove('drop');
                    kerchief.classList.add('pull-up');
                    
                    setTimeout(() => {
                        kerchief.classList.remove('pull-up'); 
                        startAutoChat(); 
                    }, 1000);
                }, 800);
                break;

            case 'truth_pepper':
    if(isBotBusy() || uiState.isSneezing) return; 
    uiState.isSneezing = true;
    
    let badHabit = globalUIConfig ? globalUIConfig.truthPepper : null;
    if(!badHabit) badHabit = translations[currentLang].truthPepperDefault;
    
    const photoDiv = document.getElementById('cold-day-photo');
    photoDiv.classList.add('sneeze-shake');
    
    setTimeout(() => {
        photoDiv.classList.remove('sneeze-shake');
        uiState.isSneezing = false; 
    }, 400);

    showTypingIndicator(1000, false).then(() => {
        appendBotMsg(translations[currentLang].truthPepperAction.replace('{habit}', badHabit), 0, 1, true);
    });
    break;

            case 'treasure_map':
                document.getElementById('treasure-map-modal').classList.add('open');
                break;
            case 'anywhere_door':
                document.getElementById('anywhere-door-modal').classList.add('open');
                break;

            case 'dream_tv':
                const tvModal = document.getElementById('dream-tv-modal');
                const iframe = document.getElementById('tv-iframe');
        
                iframe.src = "https://drive.google.com/file/d/17HLayIYyinH-eunRqnxhJTCOrgRzZzLU/preview"; 
                
                tvModal.classList.add('open');
                document.getElementById('retro-tv-content').classList.remove('tv-off-anim');
                break;

            case 'trans_bread':
                document.getElementById('bread-modal').classList.add('open');
                document.getElementById('bread-content').classList.remove('bread-bite');
                break;

            case 'personality_pill':
                if(isAppSleeping || isFakeSleeping) return;
                const tray = document.getElementById('pill-tray-content');
                document.getElementById('pill-modal').classList.add('open');
                const pillNames = globalUIConfig ? globalUIConfig.pillNames : []; 
                
                tray.innerHTML = `<h3 style="width: 100%; text-align: center; margin-bottom: 10px;">${translations[currentLang].pillTitle}</h3>`;
                
                if(!pillNames || pillNames.length === 0) {
                    tray.innerHTML += `<p style="text-align:center; width:100%;">${translations[currentLang].pillEmpty}</p>`;
                    return;
                }

                pillNames.forEach(pillName => {
                    const btn = document.createElement('button');
                    btn.className = 'pill';
                    btn.innerText = pillName;
                    btn.onclick = () => swallowPill(btn, pillName);
                    tray.appendChild(btn);
                });
                
                const resetBtn = document.createElement('button');
                resetBtn.className = 'pill';
                resetBtn.style.background = '#ccc';
                resetBtn.innerText = translations[currentLang].pillReset;
                resetBtn.onclick = () => swallowPill(resetBtn, "Bình thường");
                tray.appendChild(resetBtn);
                break;

            case 'booking_diary':
                document.getElementById('booking-modal').classList.add('open');
                document.getElementById('leather-book-content').classList.remove('book-fly');
                document.getElementById('leather-book-content').classList.remove('signing');
                break;

            case 'tin_can_phone': toggleHotlineMode(true); break;

            default:
                inputEl.value = `Đang kích hoạt bảo bối: ${id}...`;
                setTimeout(() => inputEl.value = '', 2000);
                break;
        }
    }
    function closeTreasureMap() {
        const modal = document.getElementById('treasure-map-modal');
        const paper = document.getElementById('map-paper-content');
        
        paper.classList.add('burn-anim'); 
        setTimeout(() => {
            modal.classList.remove('open');
            paper.classList.remove('burn-anim'); 
        }, 1200);
    }

    function closeDoor(e) {
        if(e.target.id === 'anywhere-door-modal') {
            const door = document.getElementById('pink-door-content');
            door.classList.add('slam');
            const ramm = new Audio('https://files.catbox.moe/a6w7re.mp3'); 
            ramm.play().catch(er=>{});
            setTimeout(() => {
                document.getElementById('anywhere-door-modal').classList.remove('open');
                door.classList.remove('slam');
            }, 600);
        }
    }

    function turnOffTV() {
        const tv = document.getElementById('retro-tv-content');
        tv.classList.add('tv-off-anim'); 
        
        setTimeout(() => {
            document.getElementById('dream-tv-modal').classList.remove('open');
            document.getElementById('tv-iframe').src = ""; 
        }, 500);
    }

    function eatBread(lang) {
        const bread = document.getElementById('bread-content');
        bread.classList.add('bread-bite'); 
        
        const biteSound = new Audio('https://files.catbox.moe/g24hvt.mp3'); 
        biteSound.play().catch(e=>{});

        setTimeout(() => {
            document.getElementById('bread-modal').classList.remove('open');
            changeLang(lang); 
        }, 800);
    }

    function swallowPill(btn, pillName) {
        btn.classList.add('swallow-anim'); 
        
        setTimeout(async () => {
            document.getElementById('pill-modal').classList.remove('open');
            currentPersonalityName = pillName === "Bình thường" ? "" : pillName; 
            
            await showTypingIndicator(1000, false);
            if(pillName === "Bình thường") {
                appendBotMsg(translations[currentLang].pillCured, 0, 1, true);
            } else {
                appendBotMsg(translations[currentLang].pillTaken.replace('{pill}', pillName), 0, 1, true);
            }
        }, 600);
    }

    function closePills(e) {
        if(e.target.id === 'pill-modal') document.getElementById('pill-modal').classList.remove('open');
    }

    /* --- DORAEMON MODE LOGIC --- */
    const tengTengSound = new Audio('https://files.catbox.moe/g8odke.m4a'); 

    function triggerDoraemonEgg() {
    if (isBotBusy()) return;
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => {
        toggleDoraemonMode();
    }, 400); 
}

    function toggleDoraemonMode() {
    const isDoraemon = document.body.classList.toggle('doraemon-mode');
    const statusEl = document.getElementById('bot-status');
    const inputEl = document.getElementById('user-input');
    const btnVang = document.getElementById('nut-vang-than-ky');

    if (isDoraemon) {
        inputEl.placeholder = translations[currentLang].doraDoorOpenPlaceholder;
        appendBotMsg(translations[currentLang].doraDoorOpenMsg, 0, 1, true);
        if(isMusicPlaying) toggleMusic();
        btnVang.classList.add('active');
        createSparkles();

    } else {
        document.body.classList.remove('door-closed');
        statusEl.innerText = translations[currentLang].status;
        inputEl.placeholder = translations[currentLang].placeholder;
        btnVang.classList.remove('active');
        if (isPocketOpen) togglePocket();
    }
}
    function triggerSneezeEgg() {
        if (isBotBusy() || uiState.isSneezing) return;
        uiState.isSneezing = true; 
        
        const photoDiv = document.getElementById('cold-day-photo');
        const imgEl = photoDiv.querySelector('img');
        
        imgEl.style.transition = "transform 0.6s ease";
        imgEl.style.transform = "scale(1.08)";

        setTimeout(() => {
            imgEl.style.transition = "none";
            photoDiv.classList.add('sneeze-shake');
            createDroplet(photoDiv);
            setTimeout(() => {
                createDroplet(photoDiv);
                const sneezeTexts = ["Hắt xì! 🤧", "ハクション!", "Achoo!"];
                for(let i = 0; i < 2; i++) {
                    const cloud = document.createElement('div');
                    cloud.className = 'sneeze-cloud-text';
                    cloud.innerText = sneezeTexts[Math.floor(Math.random() * sneezeTexts.length)];
                    cloud.style.top = (20 + Math.random() * 5) + '%';
                    cloud.style.left = (40 + Math.random() * 20) + '%';
                    cloud.style.animation = `cloud-fly 1.2s forwards ${i * 0.2}s`;
                    photoDiv.appendChild(cloud);
                    
                    setTimeout(() => cloud.remove(), 1500); 
                }
                
                setTimeout(() => {
                    photoDiv.classList.remove('sneeze-shake');
                    imgEl.style.transition = "transform 0.7s ease";
                    imgEl.style.transform = "scale(1)";
                    uiState.isSneezing = false; 
                }, 1000);

            }, 250); 

        }, 600); 
    }

    function createDroplet(container) {
        if (container.querySelectorAll('.droplet').length > 5) return;
        const drop = document.createElement('div');
        drop.className = 'droplet';
        drop.innerText = '💦';
        drop.style.top = '33%';  
        drop.style.left = '54%'; 
        
        drop.style.animation = 'sneeze-drop 0.6s forwards';
        container.appendChild(drop);
        setTimeout(() => drop.remove(), 600);
    }
    
    function recallLastEgg(force = false, targetOnly = 'normal') {
        const eggsToRecall = eggMessageIds.filter(id => force || (id.includes('music-group') ? (targetOnly === 'music' && !isMusicPlaying) : targetOnly === 'normal'));
        if (!eggsToRecall.length) return; let isFirstMerged = false;
        eggsToRecall.forEach(id => { let element = document.getElementById(id); if (element) { let bubble = element.classList.contains('msg-bubble') ? element : element.closest('.msg-bubble'); if (bubble) { if (!isFirstMerged) { bubble.innerText = translations[currentLang].eggRecalled; bubble.className = 'msg-recalled'; bubble.style.opacity = '1'; let avatar = bubble.parentElement.querySelector('.shrink-0'); if (avatar) avatar.remove(); isFirstMerged = true; } else if (bubble.parentElement) bubble.parentElement.remove(); } } });
        eggMessageIds = eggMessageIds.filter(id => !eggsToRecall.includes(id));
    }

    let blurTimer = null; 

async function triggerBlurEgg(isFromAI = false) {
    if(isBotBusy() || !document.getElementById('welcome-screen').classList.contains('hidden')) return;
    uiState.isBlurry = !uiState.isBlurry;
    
    clearTimeout(blurTimer); 

    if(uiState.isBlurry) {
        document.body.classList.add('blur-mode');
        Array.from(chatBox.children).forEach(child => child.classList.add('blurry-msg'));
        
        if (!isFromAI) {
            await showTypingIndicator(1500, false);
            appendBotMsg(translations[currentLang].eggBlur, 0, 1, true);
        } else {
            blurTimer = setTimeout(() => {
                if (uiState.isBlurry) {
                    triggerBlurEgg(true); 
                }
            }, 5000);
        }
    } else {
        document.body.classList.remove('blur-mode');
        Array.from(chatBox.children).forEach(child => child.classList.remove('blurry-msg'));
    }
}

    async function triggerDartEgg(isFromAI = false) {
    if(isBotBusy() || uiState.isDartCooldown) return;
    dartClicks++;
    if(dartClicks === 3 || isFromAI) {
        dartClicks = 0; uiState.isDartCooldown = true;
        document.getElementById('dart-icon').classList.add('dart-throw');
        setTimeout(() => { statusDot.classList.add('dart-shake'); }, 250); 
        
        const dartTimer1 = setTimeout(() => {
            statusDot.classList.remove('dart-shake');
            document.getElementById('dart-icon').classList.remove('dart-throw');
        }, 13000);
        if (!isFromAI) {
            await showTypingIndicator(1200, false);
            appendBotMsg(translations[currentLang].eggDart, 0, 1, true);
        }
        
        const dartTimer2 = setTimeout(() => { uiState.isDartCooldown = false; }, 15000); 
        activeEggTimeouts.push(dartTimer1, dartTimer2);
    }
}

    let konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], konamiCurrent = 0;
    document.addEventListener('keydown', (e) => {
      if (e.key === konamiPattern[konamiCurrent]) { 
          konamiCurrent++; 
          if (konamiCurrent === konamiPattern.length) { triggerZeldaEgg(); konamiCurrent = 0; } 
      } else { konamiCurrent = 0; }
    });

    async function triggerZeldaEgg(isFromAI = false) {
    if(isBotBusy()) return;
    resetAllVisuals();
    inputField.disabled = true; sendBtn.disabled = true; 
    let wrapper = document.getElementById('main-chat-wrapper');
    let status = document.getElementById('bot-status');
    let sword = document.getElementById('master-sword');
    
    wrapper.classList.add('zelda-mode');
    status.innerText = currentLang === 'vi' ? "🧝‍♂️ ĐANG Ở HYRULE... 🗡️" : "🧝‍♂️ IN HYRULE... 🗡️";
    status.classList.add('zelda-status');
    sword.classList.add('sword-drop-anim');
    setTimeout(() => sword.classList.remove('sword-drop-anim'), 3000);
    if (!isFromAI) {
        await showTypingIndicator(800, false); appendBotMsg(translations[currentLang].eggZelda1, 0, 3, true);
        await showTypingIndicator(1500, false); appendBotMsg(translations[currentLang].eggZelda2, 1, 3, true);
        await showTypingIndicator(1800, false); appendBotMsg(translations[currentLang].eggZelda3, 2, 3, true);
    }

    inputField.disabled = false; sendBtn.disabled = false; inputField.focus();
    const zeldaTimer = setTimeout(() => {
        wrapper.classList.remove('zelda-mode');
        status.innerText = translations[currentLang].status;
        status.classList.remove('zelda-status');
    }, 30000); 
    activeEggTimeouts.push(zeldaTimer);
}

    async function triggerStarbucksEgg(isFromAI = false) {
    if(isBotBusy()) return;
    resetAllVisuals();
    inputField.disabled = true; sendBtn.disabled = true; 
    document.getElementById('main-chat-wrapper').classList.add('starbucks-mode');
    let status = document.getElementById('bot-status');
    status.innerText = translations[currentLang].sbStatus;
    status.classList.add('sb-status');
    let tag = document.getElementById('power-tag');
    tag.innerText = "☕ CAFFEINE POWERED"; tag.style.color = "#d97706"; tag.style.background = "rgba(217, 119, 6, 0.1)";
    let cup = document.getElementById('sb-coffee');
    cup.classList.add('sb-pop-anim');
    setTimeout(() => cup.classList.remove('sb-pop-anim'), 3500);
    if (!isFromAI) {
        await showTypingIndicator(1000, false); appendBotMsg(translations[currentLang].eggSb1, 0, 3, true);
        await showTypingIndicator(1200, false); appendBotMsg(translations[currentLang].eggSb2, 1, 3, true);
        await showTypingIndicator(1500, false); appendBotMsg(translations[currentLang].eggSb3, 2, 3, true);
    }

    inputField.disabled = false; sendBtn.disabled = false; inputField.focus();
    const timerId = setTimeout(() => {
        document.getElementById('main-chat-wrapper').classList.remove('starbucks-mode');
        status.innerText = translations[currentLang].status;
        status.classList.remove('sb-status');
        checkNightTimeForCoffee(); 
    }, 30000);

    activeEggTimeouts.push(timerId);
}

    
    function triggerLogoutEgg() {
        if(isBotBusy()) return;
        resetAllVisuals();
        inputField.disabled = true; sendBtn.disabled = true; inputField.placeholder = "System shutting down...";
        const overlay = document.getElementById('logout-overlay');
        const lines = overlay.querySelectorAll('.logout-text');
        overlay.classList.add('active');
        lines[0].style.animation = `typeOut 0.8s ease forwards 1s`;
        lines[1].style.animation = `typeOut 0.8s ease forwards 3s`;
        lines[2].style.animation = `typeOut 0.8s ease forwards 5s`;
        lines[3].style.animation = `typeOut 0.8s ease forwards 7s`;
        const logoutTimer = setTimeout(() => {
            localStorage.removeItem('peih_context_' + currentSessionId);
            const welcomeScreen = document.getElementById('welcome-screen');
            welcomeScreen.style.transition = 'none'; welcomeScreen.classList.remove('hidden');
            setTimeout(() => {
                overlay.classList.remove('active');
                lines.forEach(l => l.style.animation = 'none');
                chatContextHistory = []; chatBox.innerHTML = ''; userMessageBuffer = []; eggMessageIds = [];
                const audioEl = document.getElementById('bg-audio');
                audioEl.pause(); audioEl.currentTime = 0; 
                isMusicPlaying = false; clearVisualModes(false);
                setTimeout(() => {
                    welcomeScreen.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    welcomeScreen.classList.add('hidden');
                    startAutoChat(); 
                }, 2500); 
            }, 50);
        }, 9500);
        activeEggTimeouts.push(logoutTimer);
    }
    function clearVisualModes(keepMusicText = false) {
        if (!keepMusicText && isMusicPlaying) {
            const audioEl = document.getElementById('bg-audio'); audioEl.pause(); isMusicPlaying = false;
            if (musicPauseTimer) { clearTimeout(musicPauseTimer); musicPauseTimer = null; }
            recallLastEgg(true);
        }
        const wrapper = document.getElementById('main-chat-wrapper'), status = document.getElementById('bot-status'), vis = document.getElementById('visualizer-container');
        wrapper.classList.remove('music-mode', 'zelda-mode', 'starbucks-mode');
        status.classList.remove('music-status', 'zelda-status', 'sb-status');
        if (!keepMusicText) {
        status.innerText = document.body.classList.contains('doraemon-mode') ? (currentLang === 'ja' ? "ドラえもん 🔔" : "Doraemon 🔔") : translations[currentLang].status;}
        if (vis) { vis.style.opacity = '0'; setTimeout(() => { if (!isMusicPlaying) vis.style.display = 'none'; }, 2500); }
        checkNightTimeForCoffee();
    }

    async function triggerMusicEgg(isFromAI = false) {
    if (isMusicPlaying || document.querySelector('.mini-player')) return;
    recallLastEgg(true);
    const oldInvites = document.querySelectorAll('.invite-bubble');
    oldInvites.forEach(el => {
        el.innerText = translations[currentLang].eggRecalled;
        el.className = 'msg-recalled'; el.onclick = null; el.style.animation = 'none';
        if (el.parentElement.querySelector('.shrink-0')) el.parentElement.querySelector('.shrink-0').remove();
    });

    const groupId = 'music-group-' + Date.now(); 

    if (!isFromAI) {
        await showTypingIndicator(1500, false);
        const html = `
        <div class="flex items-end gap-1.5 w-full mb-1 mt-5">
            <img src="${getAvatarUrl()}" class="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm" alt="Peih">
            <div id="${groupId}-invite" class="msg-bubble rounded-[24px] invite-bubble" onclick="acceptMusicInvite(this, '${groupId}')" style="background-color: var(--bot-msg-bg); color: var(--bot-msg-text);">
                ${translations[currentLang].musicInvite}
            </div>
        </div>`;
        chatBox.insertAdjacentHTML('beforeend', html); chatBox.scrollTop = chatBox.scrollHeight;
        eggMessageIds.push(`${groupId}-invite`); 
    } else {
        clearVisualModes(false);
        document.getElementById('main-chat-wrapper').classList.add('music-mode');
        let status = document.getElementById('bot-status');
        status.innerText = translations[currentLang].musicStatus; status.classList.add('music-status');
        
        const audioEl = document.getElementById('bg-audio');
        if (document.body.classList.contains('doraemon-mode')) {
            audioEl.src = "https://files.catbox.moe/s91g0u.mp3";
        } else {
            audioEl.src = "https://files.catbox.moe/x0bc3v.mp3";
        }
        audioEl.load();

        const playerHtml = `
        <div id="${groupId}-player" class="mini-player" onclick="toggleMusic()" style="cursor: pointer;">
          <div id="play-pause-btn" class="play-btn">▶</div>
          <div class="song-info">
            <span class="song-title">${translations[currentLang].songTitle}</span>
            <span class="song-artist">${translations[currentLang].songArtist}</span>
          </div>
        </div>`;
        setTimeout(() => {
            appendBotMsg(playerHtml, 0, 1, false); 
            eggMessageIds.push(`${groupId}-player`);
        }, 500);
    }
}

    async function acceptMusicInvite(element, groupId) {
        if (element.style.animation === 'none') return; 
        clearVisualModes(false);
        element.style.animation = 'none'; element.style.opacity = '0.6'; element.onclick = null; 
        element.classList.remove('invite-bubble'); 
        document.getElementById('main-chat-wrapper').classList.add('music-mode');
        let status = document.getElementById('bot-status');
        status.innerText = translations[currentLang].musicStatus; status.classList.add('music-status');
        const audioEl = document.getElementById('bg-audio');
        if (document.body.classList.contains('doraemon-mode')) {
            audioEl.src = "https://files.catbox.moe/s91g0u.mp3";
            document.querySelector(`#${groupId}-player .song-title`).innerText = "Yume wo Kanaete Doraemon";
            document.querySelector(`#${groupId}-player .song-artist`).innerText = "Doraemon Theme";
        } else {
            audioEl.src = "https://files.catbox.moe/x0bc3v.mp3";
        }
        audioEl.load();

        await showTypingIndicator(1200, false);
        const playerHtml = `
    <div id="${groupId}-player" class="mini-player" onclick="toggleMusic()" style="cursor: pointer;">
      <div id="play-pause-btn" class="play-btn">▶</div>
      <div class="song-info">
        <span class="song-title">${translations[currentLang].songTitle}</span>
        <span class="song-artist">${translations[currentLang].songArtist}</span>
      </div>
    </div>`;
        appendBotMsg(playerHtml, 0, 1, false); 
        eggMessageIds.push(`${groupId}-player`);
    }

    let audioCtx, analyser, dataArray, canvas, ctx, source, particles = [], gainNode;

    function initVisualizer() {
        canvas = document.getElementById('visualizer-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        const audioEl = document.getElementById('bg-audio');
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            gainNode = audioCtx.createGain(); 
            source = audioCtx.createMediaElementSource(audioEl);
            
            source.connect(analyser); 
            analyser.connect(gainNode); 
            gainNode.connect(audioCtx.destination); 
            
            analyser.fftSize = 64; dataArray = new Uint8Array(analyser.frequencyBinCount);
        }
        if (particles.length === 0) {
            for (let i = 0; i < 80; i++) {
                particles.push({
                    x: Math.random() * 400, y: Math.random() * 100, size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.5, speedY: (Math.random() - 0.5) * 0.5,
                    color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`
                });
            }
        }
        animateParticles();
    }

    function animateParticles() {
        if (!isMusicPlaying) return;
        requestAnimationFrame(animateParticles);
        analyser.getByteFrequencyData(dataArray);
        let sum = 0; for(let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        let intensity = sum / dataArray.length; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
            canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
        }
        particles.forEach(p => {
            let musicBoost = intensity / 15; p.x += p.speedX * (1 + musicBoost); p.y += p.speedY * (1 + musicBoost);
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + musicBoost / 4), 0, Math.PI * 2);
            ctx.fillStyle = p.color; ctx.fill();
        });
    }

    function fadeAudio(audioEl, targetVolume, duration, onComplete) {
        const startVol = (typeof gainNode !== 'undefined' && gainNode) ? gainNode.gain.value : audioEl.volume;
        const change = targetVolume - startVol;
        const stepTime = duration / 20; let currentStep = 0;
        
        if(audioEl.fadeInterval) clearInterval(audioEl.fadeInterval);
        
        audioEl.fadeInterval = setInterval(() => { 
            currentStep++; 
            let newVol = startVol + change * (currentStep / 20); 
            newVol = newVol > 1 ? 1 : (newVol < 0 ? 0 : newVol);
            
            if (typeof gainNode !== 'undefined' && gainNode) { gainNode.gain.value = newVol; }
            audioEl.volume = newVol; 
            
            if(currentStep >= 20){ 
                clearInterval(audioEl.fadeInterval); 
                if (typeof gainNode !== 'undefined' && gainNode) { gainNode.gain.value = targetVolume; }
                audioEl.volume = targetVolume; 
                if(onComplete) onComplete(); 
            } 
        }, stepTime);
    }

    function toggleMusic() {
    const audioEl = document.getElementById('bg-audio');
    const btn = document.getElementById('play-pause-btn');
    const vis = document.getElementById('visualizer-container');
    const wrapper = document.getElementById('main-chat-wrapper');
    const status = document.getElementById('bot-status');

    if (!audioEl.dataset.ended) {
        audioEl.addEventListener('ended', () => {
            btn.innerText = "▶";
            isMusicPlaying = false;
            resetAllVisuals(); 
            audioEl.currentTime = 0;
        });
        audioEl.dataset.ended = 'true';
    }
    if (musicPauseTimer) { clearTimeout(musicPauseTimer); musicPauseTimer = null; }
    if (audioEl.fadeInterval) { clearInterval(audioEl.fadeInterval); }
    if (!isMusicPlaying) {
        isMusicPlaying = true;
        btn.innerText = "⏸";
        wrapper.classList.add('music-mode');
        status.classList.add('music-status');
        status.innerText = translations[currentLang].musicStatus;
        
        if (vis) {
            vis.style.display = 'block';
            void vis.offsetWidth;
            vis.style.opacity = '0.8';
        }
        if (typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        audioEl.play().then(() => {
            initVisualizer();
            fadeAudio(audioEl, 1, 800); 
        }).catch(e => console.error("Lỗi phát nhạc:", e));
    } else {
        isMusicPlaying = false;
        btn.innerText = "▶";
        wrapper.classList.remove('music-mode');
        status.classList.remove('music-status');
        status.innerText = document.body.classList.contains('doraemon-mode') ? (currentLang === 'ja' ? "ドラえもん 🔔" : "Doraemon 🔔") : translations[currentLang].status;
        if (vis) {
            vis.style.opacity = '0';
            setTimeout(() => { if (!isMusicPlaying) vis.style.display = 'none'; }, 1000);
        }
        fadeAudio(audioEl, 0, 1000, () => {
            audioEl.pause();
            musicPauseTimer = setTimeout(() => {
                if (!isMusicPlaying) recallLastEgg(false, 'music');
            }, 10000);
        });
    }
}

    function checkNightTimeForCoffee() {
        const h = new Date().getHours();
        let tag = document.getElementById('power-tag');
        
        if(h >= 1 && h < 3) {
            tag.innerText = "☕ CAFFEINE POWERED"; 
            tag.style.color = "#d97706"; 
            tag.style.background = "rgba(217, 119, 6, 0.1)";
        } else {
            tag.innerText = "M1 PRO POWERED"; 
            tag.style.color = "var(--text-sub)"; 
            tag.style.background = "rgba(255,255,255,0.1)";
        }
    }

    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex); currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function checkTimeForSleep() {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const isAfternoonSleep = (h === 13 && m >= 30);
        const isNightSleep = (h >= 2 && h < 6);
        return isAfternoonSleep || isNightSleep;
    }
    
    function resetAfkTimer() {
        clearTimeout(afkTimer);
        if (!isAppSleeping && !isFakeSleeping && checkTimeForSleep()) afkTimer = setTimeout(triggerFakeSleep, 600000); 
    }

    async function triggerFakeSleep() {
        if (isAppSleeping || isFakeSleeping) return;
        hideSecretTooltip();
        isFakeSleeping = true; fakeSleepStep = 1; isDeepSleep = Math.random() < 0.3; 
        statusDot.className = 'w-3 h-3 bg-purple-500 rounded-full pulse-anim shadow-[0_0_10px_#a855f7] shrink-0';
        document.getElementById('bot-status').innerText = translations[currentLang].fakeSleepStatus;
        inputField.disabled = true; inputField.placeholder = translations[currentLang].fakeHolder1;
        sendBtn.disabled = true; sendBtn.innerText = translations[currentLang].fakeBtn1;
        const tc = document.getElementById('thought-cloud');
        tc.innerText = translations[currentLang].fakeCloud1; tc.classList.remove('hidden');
        document.getElementById('sleep-text-hint').innerText = translations[currentLang].emptySleepHint;
        emptySleep.classList.remove('hidden'); emptySleep.classList.add('flex'); dreamContainer.classList.add('active');
        await showTypingIndicator(1200, false); appendBotMsg(translations[currentLang].fakeStartMsg, 0, 2);
        await new Promise(r => setTimeout(r, 600)); await showTypingIndicator(1500, true); appendZzzMsg();
        startDreaming(); sendBtn.disabled = false; 
    }

    function appendZzzMsg() {
        const avatarUrl = getAvatarUrl();
        const html = `<div class="flex items-end gap-1.5 w-full mb-1">
            <img src="${avatarUrl}" class="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm" alt="Peih">
            <div class="msg-bubble rounded-[24px] rounded-tl-[6px] zzz-anim" style="background-color: var(--bot-msg-bg); color: var(--bot-msg-text); border: 1px solid var(--glass-border);">
                <span>Z</span><span>z</span><span>z</span>...
            </div></div>`;
        chatBox.insertAdjacentHTML('beforeend', html); chatBox.scrollTop = chatBox.scrollHeight;
    }

    function spawnDream() {
        if (!isFakeSleeping) return;
        if (dreamQueue.length === 0) dreamQueue = shuffleArray([...translations[currentLang].dreams]);
        const text = dreamQueue.pop(); const el = document.createElement('div');
        el.className = 'dream-text'; el.innerText = text; dreamContainer.appendChild(el);
        setTimeout(() => { if (el && el.parentNode) el.remove(); }, 5000);
    }

    function startDreaming() {
        clearInterval(dreamTimer); dreamContainer.innerHTML = ''; 
        dreamQueue = shuffleArray([...translations[currentLang].dreams]);
        spawnDream(); dreamTimer = setInterval(spawnDream, 4500);
    }
    async function handleFakeWakeUp() {
        document.getElementById('thought-cloud').classList.add('hidden');
        sendBtn.disabled = true; sendBtn.innerText = "...";
        currentBubblesContainer = null; if (previousReceiptDiv) { previousReceiptDiv.remove(); previousReceiptDiv = null; }
        if (fakeSleepStep === 1) {
            appendUserMsgToUI(translations[currentLang].fakePoke); currentBubblesContainer = null; 
            await new Promise(r => setTimeout(r, 800));
            if (isDeepSleep) { 
                await showTypingIndicator(1500, false); appendBotMsg(translations[currentLang].fakeRep1, 0, 1);
                fakeSleepStep = 2; inputField.placeholder = translations[currentLang].fakeHolder2;
                sendBtn.innerText = translations[currentLang].fakeBtn2; sendBtn.disabled = false;
                const tc = document.getElementById('thought-cloud');
                tc.innerText = translations[currentLang].fakeCloud2; tc.classList.remove('hidden');
            } else { 
                await showTypingIndicator(1000, false); appendBotMsg(translations[currentLang].fakeRep2, 0, 1); wakeUpCompletely();
            }
        } 
        else if (fakeSleepStep === 2) {
            appendUserMsgToUI(translations[currentLang].fakeYell); currentBubblesContainer = null;
            await new Promise(r => setTimeout(r, 600)); await showTypingIndicator(1200, false);
            appendBotMsg(translations[currentLang].fakeRep2, 0, 1); wakeUpCompletely();
        }
    }

    function wakeUpCompletely() {
        isFakeSleeping = false; fakeSleepStep = 0; clearInterval(dreamTimer); dreamQueue = [];
        statusDot.className = 'w-3 h-3 bg-green-500 rounded-full pulse-anim shadow-[0_0_10px_#22c55e] shrink-0';
        document.getElementById('bot-status').innerText = document.body.classList.contains('doraemon-mode') ? (currentLang === 'ja' ? "ドラえもん 🔔" : "Doraemon 🔔") : translations[currentLang].status;
        emptySleep.classList.add('hidden'); emptySleep.classList.remove('flex'); dreamContainer.classList.remove('active'); dreamContainer.innerHTML = ''; 
        inputField.disabled = false; if (window.currentRealName && window.currentRealName.trim() !== "") {
            inputField.placeholder = translations[currentLang].placeholderWithName.replace('{name}', window.currentRealName);
        } else {
            inputField.placeholder = translations[currentLang].placeholder;
        }
        sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].sendBtn;
        inputField.focus(); resetAfkTimer();
    }

function changeLang(lang, isInit = false) {
  let savedLang = lang;
  if (!translations[lang] && !window.isAutoFetchingLang) {
    savedLang = lang;
    lang = 'en'; 
    window.isAutoFetchingLang = true;
    window.wasInitLoad = isInit; 
    
    let attempts = 0;
    const checkWelcome = setInterval(() => {
      attempts++;
      const welcome = document.getElementById('welcome-screen');
      if ((welcome && welcome.classList.contains('hidden')) || attempts > 20) {
        clearInterval(checkWelcome);
        setTimeout(() => {
          requestCustomLanguage(savedLang, '🌐 ' + savedLang.toUpperCase());
        }, 500);
      }
    }, 500);
  }
  if (window.isAutoFetchingLang && translations[lang] && lang !== 'en') {
    isInit = window.wasInitLoad !== undefined ? window.wasInitLoad : true;
    window.isAutoFetchingLang = false;
    if (isInit && typeof chatContextHistory !== 'undefined' && chatContextHistory.length === 0) {
        setTimeout(startAutoChat, 500);
    }
  }
  currentLang = lang;
  try { localStorage.setItem('peih_lang', savedLang); } catch(e) {}

  const langMap = {
        'vi': '🇻🇳 VI', 'en': '🇺🇸 EN', 'ja': '🇯🇵 JP',
        'it': '🇮🇹 IT', 'la': '🇻🇦 LA', 'tl': '🇵🇭 TL', 'zh-tw': '🇹🇼 TW',
        'my': '🇲🇲 MY', 'fr': '🇫🇷 FR', 'ko': '🇰🇷 KO', 'zh': '🇨🇳 ZH',
        'es': '🇪🇸 ES', 'de': '🇩🇪 DE', 'th': '🇹🇭 TH', 'ru': '🇷🇺 RU', 'ar': '🇸🇦 AR'
    };
  const displayEl = document.getElementById('current-lang-display');
  if (displayEl) {
    let savedFlag = translations[lang] ? translations[lang].customFlag : null;
    let finalFallback = savedFlag || window.customTempFlag || localStorage.getItem('peih_custom_flag_' + lang);
    let fallbackFlag = finalFallback ? (finalFallback + " " + lang.toUpperCase()) : ("🌐 " + lang.toUpperCase());
    displayEl.innerText = langMap[lang.toLowerCase()] || fallbackFlag;
  }
  activePrivacyMenus = [];      
  activePrivacyContents = {};   
  introPrivacyId = null;        
  isPrivacyLocked = false;      
  document.documentElement.style.setProperty('--dora-bread-text', `'${translations[lang].cssBread}'`);
  document.getElementById('secret-tooltip').innerText = translations[lang].secretTooltip;
  document.getElementById('footer-text').innerHTML = translations[lang].footerText;
  document.getElementById('sub-title').innerText = translations[lang].sub;
  let isMaintMode = document.getElementById('maint-state-container') && document.getElementById('maint-state-container').classList.contains('flex');
  document.getElementById('bot-status').innerText = document.body.classList.contains('doraemon-mode') ? (lang === 'ja' ? "ドラえもん 🔔" : "Doraemon 🔔") : (isMaintMode ? translations[lang].maintStatus : translations[lang].status);
  document.getElementById('bot-disclaimer').innerText = translations[lang].disclaimer; 
  document.getElementById('cap-1').innerHTML = translations[lang].cap1;
  document.getElementById('cap-2').innerHTML = translations[lang].cap2;

  document.getElementById('logout-1').innerText = translations[lang].logout1;
  document.getElementById('logout-2').innerText = translations[lang].logout2;
  document.getElementById('logout-3').innerText = translations[lang].logout3;
  document.getElementById('logout-4').innerText = translations[lang].logout4;
  document.getElementById('thought-cloud').innerText = translations[lang].fakeCloud1;
  document.getElementById('pocket-title').innerText = translations[lang].pocketTitle;
  document.getElementById('pocket-hint').innerText = translations[lang].pocketHint;
  document.getElementById('map-title').innerText = translations[lang].mapTitle;
  document.getElementById('map-l1').innerHTML = translations[lang].mapL1;
  document.getElementById('map-l2').innerHTML = translations[lang].mapL2;
  document.getElementById('map-l3').innerHTML = translations[lang].mapL3;
  document.getElementById('map-l4').innerHTML = translations[lang].mapL4;
  document.getElementById('map-hint').innerText = translations[lang].mapHint;
  document.getElementById('door-title').innerText = translations[lang].doorTitle;
  document.getElementById('tv-off-btn').innerText = translations[lang].tvOff;
  document.getElementById('bread-title').innerText = translations[lang].breadTitle;
  document.getElementById('book-title').innerText = translations[lang].bookTitle;
  document.getElementById('book-name').placeholder = translations[lang].bookNameHold;
  document.getElementById('book-note').placeholder = translations[lang].bookNoteHold;
  document.getElementById('book-submit-btn').innerText = translations[lang].bookSubmit;
  document.getElementById('menu-threads-text').innerText = translations[lang].threadTitle;
  document.getElementById('header-threads-text').innerText = translations[lang].threadTitle;
  document.getElementById('floating-back-text').innerText = translations[lang].threadBackBtn;
  const maintHintEl = document.getElementById('maint-text-hint');
  if (maintHintEl) maintHintEl.innerText = translations[lang].maintHint;
  if (document.getElementById('carousel-list').innerHTML !== '') renderCarousel();

  if (isMaintMode) {
    document.getElementById('send-btn').innerText = "...";
  } else {
     document.getElementById('send-btn').innerText = isAppSleeping ? translations[currentLang].wakeBtn : translations[currentLang].sendBtn;
  } 
  statusNote.innerText = quotes[(quoteIndex === 0 ? quotes.length - 1 : quoteIndex - 1)][currentLang];

  if (!isInit) {
      if (window.isSystemHalted) {
          chatBox.innerHTML = ''; 
          appendSystemMsg(getDynamicSystemLostMsg()); 
          inputField.disabled = true; 
          sendBtn.disabled = true;
          inputField.placeholder = translations[currentLang].disconnected; 
          return;
      }
      chatContextHistory = []; localStorage.removeItem('peih_context_' + currentSessionId);
      chatBox.innerHTML = ''; userMessageBuffer = []; currentBubblesContainer = null; previousReceiptDiv = null;
      document.getElementById('thought-cloud').classList.add('hidden');
      emptySleep.classList.remove('active'); dreamContainer.classList.remove('active'); dreamContainer.innerHTML = '';
      isFakeSleeping = false; clearInterval(dreamTimer); dreamQueue = []; resetAfkTimer();
      clearTimeout(typingTimer); clearTimeout(inputIdleTimer);
      
      const threadsLoader = document.getElementById('threads-loader');
      if (threadsLoader) threadsLoader.innerText = translations[lang].threadLoading;
      if (window.cachedThreadsData) {
          renderThreadsList(window.cachedThreadsData);
      }
      if (isMaintMode) {
          inputField.placeholder = translations[currentLang].maintPlaceholder;
      } else if(isAppSleeping) {
          inputField.placeholder = translations[currentLang].sleepPlaceholder;
          appendBotMsg(translations[currentLang].sleepyMsg1, 0, 2); appendBotMsg(translations[currentLang].sleepyMsg2, 1, 2);
          appendSystemMsg(translations[currentLang].sleepMsg);
      } else {
        inputField.disabled = true; sendBtn.disabled = true;  
        if (window.currentRealName && window.currentRealName.trim() !== "") {
            inputField.placeholder = translations[currentLang].placeholderWithName.replace('{name}', window.currentRealName);
        } else {
            inputField.placeholder = translations[currentLang].connecting; 
        }
        startAutoChat();
      }
      if (isHotlineMode) {
          document.getElementById('btn-end-call').innerText = translations[lang].btnEndCall;
          document.getElementById('user-input').placeholder = translations[lang].tinCanPlaceholder;
      }
  }
}

    function toggleFullscreen() {
        const wrapper = document.getElementById('main-chat-wrapper');
        const icon = document.getElementById('fs-icon');
        
        const isNowFull = wrapper.classList.toggle('chat-fullscreen');
        document.body.classList.toggle('fs-active');
        document.body.classList.toggle('no-scroll');

        if (isNowFull) {
            if (wrapper.requestFullscreen) { wrapper.requestFullscreen(); }
            else if (wrapper.webkitRequestFullscreen) { wrapper.webkitRequestFullscreen(); }
            else if (wrapper.msRequestFullscreen) { wrapper.msRequestFullscreen(); }
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 9h5V4 M4 4l5 5 M20 9h-5V4 M20 4l-5 5 M4 15h5v5 M4 20l5-5 M20 15h-5v5 M20 20l-5-5"></path>';
        } else {
            if (document.exitFullscreen) { document.exitFullscreen(); }
            else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>';
        }
        
        window.scrollTo(0, 0); 
        setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 50);
    }
    function clearChat() {
      if(autoChatActive || isAppSleeping || isFakeSleeping || userMessageBuffer.length > 0) return; 
      let confirmMsg = translations[currentLang].clearChatConfirm;
      if (confirm(confirmMsg)) {
        const audioEl = document.getElementById('bg-audio');
        audioEl.pause(); audioEl.currentTime = 0; 
        isMusicPlaying = false;
        if (typeof clearVisualModes === 'function') clearVisualModes(false);
        eggMessageIds = []; chatContextHistory = []; localStorage.removeItem('peih_context_' + currentSessionId);
        chatBox.innerHTML = ''; inputField.disabled = true; sendBtn.disabled = true;
        inputField.placeholder = translations[currentLang].connecting; startAutoChat();
      }
    }

    function getAvatarUrl() { 
        if (document.body.classList.contains('doraemon-mode')) {
            return 'https://lh3.googleusercontent.com/u/0/d/1hNYpKhVCHSU7999IesjQoNktNOnNqr9k';
        }
        const img = document.getElementById('main-profile-pic'); 
        return img ? img.src : ''; 
    }
    function appendSystemMsg(text) { const html = `<div class="system-bubble">${text}</div>`; chatBox.insertAdjacentHTML('beforeend', html); chatBox.scrollTop = chatBox.scrollHeight; }

  function appendBotMsg(text, index = 0, total = 1, isEgg = false, isRealPeih = false) {
    if(isEgg && index === 0) recallLastEgg(false, 'normal');
    let shapeClass = "rounded-[24px]", showAvatar = true;
    if (total > 1) {
        if (index === 0) { shapeClass = "rounded-[24px] rounded-bl-[6px]"; showAvatar = false; }
        else if (index === total - 1) { shapeClass = "rounded-[24px] rounded-tl-[6px]"; showAvatar = true; }
        else { shapeClass = "rounded-[24px] rounded-bl-[6px] rounded-tl-[6px]"; showAvatar = false; }
    }
    let crownHtml = (isRealPeih && showAvatar) ? `<div class="crown-icon">👑</div>` : '';
    const baseAvatar = showAvatar && !document.body.classList.contains('blur-mode') ? `<img src="${getAvatarUrl()}" class="w-8 h-8 rounded-full object-cover shadow-sm" alt="Peih">` : `<div class="w-8 h-8 relative">${showAvatar ? `<img src="${getAvatarUrl()}" class="w-full h-full rounded-full object-cover shadow-sm">` : ''}</div>`; 
    const avatarHtml = `<div class="w-8 h-8 shrink-0 avatar-container">${crownHtml}${showAvatar ? baseAvatar : ''}</div>`;
    const marginTopClass = (index === 0) ? "mt-5" : "";
    const msgId = isEgg ? `egg-msg-${Date.now()}-${index}` : '';
    const bubbleStyle = isRealPeih ? "" : "background-color: var(--bot-msg-bg); color: var(--bot-msg-text); border: 1px solid var(--glass-border);";
    const bubbleClass = isRealPeih ? "real-person-bubble" : "";
    const html = `<div class="flex items-end gap-1.5 w-full mb-1 ${marginTopClass}">${avatarHtml}<div ${isEgg ? `id="${msgId}"` : ''} class="msg-bubble ${shapeClass} ${bubbleClass}" style="${bubbleStyle}">${text}</div></div>`;
    
    chatBox.insertAdjacentHTML('beforeend', html); chatBox.scrollTop = chatBox.scrollHeight;
    
    if (isEgg) eggMessageIds.push(msgId);
    if (document.body.classList.contains('doraemon-mode') && !isEgg && index === 0) { tengTengSound.currentTime = 0; tengTengSound.play().catch(e => {}); }
    if (!window.isRestoringHistory && currentSessionId && typeof database !== 'undefined') {
        if (!isRealPeih) { 
            const sysId = Date.now() + Math.floor(Math.random() * 1000) + index;
            database.ref(`chats/${currentSessionId}/${sysId}`).set({
                sender: 'Peih AI', 
                text: text,
                timestamp: Date.now()
            });
        }
    }
}

    function showTypingIndicator(ms, isGrouped = false) {
        return new Promise(resolve => {
            const id = 'typing-' + Date.now();
            let shapeClass = isGrouped ? "rounded-[24px] rounded-tl-[6px]" : "rounded-[24px]";
            const avatarHtml = `<img src="${getAvatarUrl()}" class="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm" alt="Peih">`;
            const html = `<div id="${id}" class="flex items-end gap-1.5 w-full mb-1 ${isGrouped ? "" : "mt-5"}">
                ${avatarHtml}
                <div class="${shapeClass} px-4 py-3 flex gap-1 items-center shadow-sm h-[38px]" style="background-color: var(--bot-msg-bg); border: 1px solid var(--glass-border);">
                    <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
                </div></div>`;
            chatBox.insertAdjacentHTML('beforeend', html); chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(() => { const el = document.getElementById(id); if (el) el.remove(); resolve(); }, ms);
        });
    }

    async function startAutoChat() {
      if (window.isAutoFetchingLang) return;
      autoChatActive = true; chatSequenceId++; const mySeq = chatSequenceId; 
      await new Promise(r => setTimeout(r, 500)); if (mySeq !== chatSequenceId) return; 
      if(checkTimeForSleep()) { triggerFakeSleep(); autoChatActive = false; return; }
      await showTypingIndicator(1200, false); if (mySeq !== chatSequenceId) return; 
      appendBotMsg(translations[currentLang].msg1, 0, 2); 
      await new Promise(r => setTimeout(r, 500)); if (mySeq !== chatSequenceId) return; 
      await showTypingIndicator(2000, true); if (mySeq !== chatSequenceId) return; 
      appendBotMsg(translations[currentLang].msg2, 1, 2); 
      inputField.disabled = false; sendBtn.disabled = false; inputField.placeholder = translations[currentLang].placeholder;
      autoChatActive = false; resetAfkTimer();
    }

    function appendUserMsgToUI(text) {
      currentAdminBubblesContainer = null;
        if (!currentBubblesContainer && previousReceiptDiv) { previousReceiptDiv.remove(); previousReceiptDiv = null; }
        if (!currentBubblesContainer) {
            const groupWrapper = document.createElement('div'); groupWrapper.className = 'user-msg-group';
            currentBubblesContainer = document.createElement('div'); currentBubblesContainer.className = 'user-bubbles';
            groupWrapper.appendChild(currentBubblesContainer); chatBox.appendChild(groupWrapper);
        }
        const msgDiv = document.createElement('div'); msgDiv.className = 'msg-bubble';
        msgDiv.style.backgroundColor = 'var(--user-msg-bg)'; msgDiv.style.color = 'var(--user-msg-text)';
        msgDiv.innerText = text; currentBubblesContainer.appendChild(msgDiv);
        const groupWrapper = currentBubblesContainer.parentElement;
        if (currentReceiptDiv) currentReceiptDiv.remove();
        currentReceiptDiv = document.createElement('div'); currentReceiptDiv.className = 'read-receipt';
        currentReceiptDiv.innerText = translations[currentLang].sent; groupWrapper.appendChild(currentReceiptDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendUserMsgHistory(text) {
    const isRecalled = Object.values(translations).some(t => t.toxicRecalled === text);
    if (isRecalled) {
        const html = `
            <div class="user-msg-group">
                <div class="msg-recalled" style="margin-left: auto; margin-right: 0; text-align: right;">
                    ${text}
                </div>
            </div>`;
        chatBox.insertAdjacentHTML('beforeend', html);
    } else {
        const parts = text.split('\n').filter(m => m.trim() !== '');
        let bubblesHtml = ''; 
        parts.forEach(p => { 
    const safeText = escapeHTML(p); 
    bubblesHtml += `<div class="msg-bubble" style="background-color: var(--user-msg-bg); color: var(--user-msg-text);">${safeText}</div>`;});
        const html = `<div class="user-msg-group"><div class="user-bubbles">${bubblesHtml}</div></div>`;
        chatBox.insertAdjacentHTML('beforeend', html);
    }
}
function getDynamicSystemLostMsg() {
    const msgs = {
        vi: "⚠️ Kết nối đến máy chủ bị gián đoạn. Vui lòng kiểm tra mạng hoặc tải lại trang.",
        en: "⚠️ Connection to the server was interrupted. Please check your network or refresh.",
        ja: "⚠️ サーバーへの接続が中断されました。ネットワークを確認するか、再読み込みしてください。"
    };
    let html = `<b style="color: #ef4444; font-size: 13px;">${msgs[currentLang]}</b><br><span style="font-size:11px; opacity:0.7; display:block; margin-top:6px; line-height:1.6; color: var(--text-main);">`;
    
    Object.keys(msgs).forEach(lang => {
        if (lang !== currentLang) {
            html += msgs[lang] + "<br>";
        }
    });
    
    html += "</span>";
    html += `<button onclick="forceReconnect(this)" style="margin-top: 12px; padding: 6px 16px; background: var(--text-main); color: var(--bg-color); border-radius: 20px; font-weight: bold; font-size: 12px; cursor: pointer; transition: opacity 0.3s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">Thử lại / Retry</button>`;
    return html;
}
    window.forceReconnect = function(btn) {
    if (!navigator.onLine) {
        if (btn) {
            btn.innerHTML = '❌ Vẫn chưa có mạng!';
            setTimeout(() => { if (btn) btn.innerHTML = 'Thử lại / Retry'; }, 2000);
        }
        return;
    }
    if (btn) {
        btn.innerHTML = '⏳ Đang kết nối...';
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none'; 
    }
    window.dispatchEvent(new Event('online'));

    setTimeout(() => {
        if (btn && document.body.contains(btn)) {
            btn.innerHTML = 'Thử lại / Retry';
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto'; 
        }
    }, 3000);
}
    window.isSystemHalted = false;
    changeLang(currentLang, true);
    document.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      if (ref) {
          window.guestSource = ref;
          window.history.replaceState({}, document.title, window.location.pathname);
      }
      setTimeout(() => {
          fetchLocation(); 
      }, 2500);
      loadDailyStories();
      checkNightTimeForCoffee(); inputField.placeholder = translations[currentLang].connecting; 
      document.documentElement.style.setProperty('--dora-bread-text', `'${translations[currentLang].cssBread}'`);

      const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); } }); }, { threshold: 0.1 });
      document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
      
      let isConfigLoaded = false;
      let loadingTimer4s = setTimeout(() => {
          if (!isConfigLoaded) {
              const welcomeScreen = document.getElementById('welcome-screen');
              if (welcomeScreen && !document.getElementById('peih-spinner')) {
                  welcomeScreen.insertAdjacentHTML('beforeend', 
                      `<div id="peih-spinner" class="mt-10 flex flex-col items-center opacity-0 transition-opacity duration-1000">
                          <div class="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                          <div class="text-[13px] mt-4 font-medium text-gray-500 tracking-wide"> ${translations[currentLang].syncingData} </div>
                      </div>`
                  );
                  setTimeout(() => document.getElementById('peih-spinner').classList.remove('opacity-0'), 100);
              }
          }
      }, 4000);

      let loadingTimer10s = setTimeout(() => {
          if (!isConfigLoaded) {
              window.isSystemHalted = true; 
              document.getElementById('welcome-screen').classList.add('hidden');
              appendSystemMsg(getDynamicSystemLostMsg());
              inputField.disabled = true; 
              sendBtn.disabled = true;
              inputField.placeholder = translations[currentLang].disconnected; 
          }
      }, 15000);
      function formatETA(timestamp) {
          if (!timestamp || timestamp === 0) return "";
          const d = new Date(timestamp);
          const hrs = d.getHours().toString().padStart(2, '0');
          const mins = d.getMinutes().toString().padStart(2, '0');
          const day = d.getDate().toString().padStart(2, '0');
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          return `${hrs}:${mins} - ${day}/${month}`;
      }
      google.script.run.withSuccessHandler(async function(payload) {
          isConfigLoaded = true; 
          clearTimeout(loadingTimer4s);
          clearTimeout(loadingTimer10s);

          const sysBubbles = document.querySelectorAll('.system-bubble');
          sysBubbles.forEach(b => { if (b.innerText.includes("⚠️")) b.remove(); });
          globalUIConfig = payload.uiConfig;
          window.cachedThreadsData = payload.threadsData; 
          let config = payload.uiConfig; 
          const lockEtaContainer = document.getElementById('lock-eta-container');
          const maintEtaContainer = document.getElementById('maint-eta-container');
          
          if (config.lockEnd && config.lockEnd > 0) {
              let lockText = { vi: "[MỞ LẠI: ", en: "[SYSTEM RESUME: ", ja: "[再起動予定: " }[currentLang];
              const textEl = document.getElementById('lock-eta-text');
              if (textEl) textEl.innerText = lockText + formatETA(config.lockEnd) + "]";
              if (lockEtaContainer) lockEtaContainer.classList.remove('hidden');
          }
          
          if (config.maintEnd && config.maintEnd > 0) {
              let maintText = { vi: "> ETA_HOÀN_THÀNH: ", en: "> ETA_COMPLETION: ", ja: "> 完了予定時刻: " }[currentLang];
              const textEl2 = document.getElementById('maint-eta-text');
              if (textEl2) textEl2.innerText = maintText + formatETA(config.maintEnd);
              if (maintEtaContainer) maintEtaContainer.classList.remove('hidden');
          }
          let n = Date.now();
          if (config.maintStart > 0 && config.maintEnd > 0 && n >= config.maintStart && n <= config.maintEnd) {config.appStatus = "MAINT";}
          if (config.lockStart > 0 && config.lockEnd > 0 && n >= config.lockStart && n <= config.lockEnd) {config.appStatus = "LOCK";}
          let uT = 0;
          let uY = "";
          if (config.lockStart > 0 && n < config.lockStart && (config.lockStart - n) <= 3600000) { uT = config.lockStart; uY = "LOCK";
          } else if (config.maintStart > 0 && n < config.maintStart && (config.maintStart - n) <= 3600000) {
          uT = config.maintStart;uY = "MAINT";}

          if (uT > 0) {
            let uBubble = document.getElementById('upcoming-warning-bubble');
            let uText = document.getElementById('upcoming-warning-text');  
            let actVi = uY === "LOCK" ? "Bảo trì trang" : "Bảo trì tin nhắn";
            let actEn = uY === "LOCK" ? "Under maintenance" : "Message maintenance";
            let actJa = uY === "LOCK" ? "サイトメンテナンス" : "メッセージメンテナンス";
            let uLang = {
              vi: `${actVi} lúc ${formatETA(uT)}`,
              en: `${actEn} at ${formatETA(uT)}`,
              ja: `${formatETA(uT)} に ${actJa}実施`
            };
           uText.innerText = uLang[currentLang] || uLang.vi;
           uBubble.classList.remove('hidden');
           uBubble.classList.add('flex', 'items-center');
    
           setTimeout(() => {
             uBubble.classList.remove('opacity-0', '-translate-y-4');
             uBubble.classList.add('opacity-100', 'translate-y-0');
           }, 1000);
          }
          
          if(config.appStatus === "LOCK") {
              document.getElementById('welcome-screen').classList.remove('hidden');
              setTimeout(() => {
                  const gate = document.getElementById('gatekeeper-screen');
                  if(gate) {
                      gate.classList.remove('hidden');
                      gate.classList.add('flex');
                      setTimeout(() => gate.classList.remove('opacity-0'), 50); 
                  }
                  
                  const appContainer = document.querySelector('.app-container');
                  if (appContainer) appContainer.remove(); 
                  
                  document.body.style.overflow = 'hidden'; 
              }, 4500); 
              
              return; 
          }
          document.getElementById('welcome-screen').classList.add('hidden');
          if(config.appStatus === "MAINT") {
             chatBox.innerHTML = ''; 
             toggleM1Maintenance(true);
             isAppSleeping = true;
         } 
         else if(config.appStatus === "OFF") {
             toggleM1Maintenance(false);
             isAppSleeping = true; 
             inputField.disabled = true; sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].wakeBtn;
             inputField.placeholder = translations[currentLang].sleepPlaceholder; statusDot.className = 'w-3 h-3 bg-red-500 rounded-full shrink-0';
             await showTypingIndicator(1000, false); appendBotMsg(translations[currentLang].sleepyMsg1, 0, 2);
             await showTypingIndicator(1500, true); appendBotMsg(translations[currentLang].sleepyMsg2, 1, 2);
             setTimeout(() => { appendSystemMsg(translations[currentLang].sleepMsg); }, 1200);
         } else {
             toggleM1Maintenance(false); 
             if(chatContextHistory.length > 0) {
                 window.isRestoringHistory = true;
                 chatContextHistory.forEach(msg => {
                    if(msg.role === 'user') appendUserMsgHistory(msg.text); 
                    else {
                       let botText = msg.text.replace(/\\n/g, '\n');
                       let isReal = false;
                       if (botText.startsWith("REAL|")) { isReal = true; botText = botText.replace("REAL|", ""); }
                       const parts = botText.split('\n').filter(m => m.trim() !== '');
                       parts.forEach((p, idx) => appendBotMsg(p, idx, parts.length, false, isReal));
                    }
                 });
                 window.isRestoringHistory = false; 
                 chatBox.scrollTop = chatBox.scrollHeight; inputField.disabled = false; sendBtn.disabled = false;
                 inputField.placeholder = translations[currentLang].placeholder; resetAfkTimer();
             } else { inputField.disabled = true; sendBtn.disabled = true; startAutoChat(); }
         }
        }).withFailureHandler(function() {
            window.isSystemHalted = true; 
            isConfigLoaded = true; 
            clearTimeout(loadingTimer4s);
            clearTimeout(loadingTimer10s);
            document.getElementById('welcome-screen').classList.add('hidden');
            appendSystemMsg(getDynamicSystemLostMsg());
            inputField.disabled = true; 
            sendBtn.disabled = true;
            inputField.placeholder = translations[currentLang].disconnected; 
        }).getInitialAppPayload(currentLang); 
        
      setInterval(rotateQuotes, 6000); rotateQuotes();
    });

    function handleMainAction() {
      if (isFakeSleeping) handleFakeWakeUp();
      else if (isAppSleeping) checkWakeUp(); 
      else handleChatSend(); 
    }

    function checkWakeUp() {
      sendBtn.disabled = true; sendBtn.innerText = "...";
      currentBubblesContainer = null; if (previousReceiptDiv) { previousReceiptDiv.remove(); previousReceiptDiv = null; }
      appendUserMsgToUI(translations[currentLang].wakeUpCall);
      currentBubblesContainer = null; if (currentReceiptDiv) { currentReceiptDiv.innerText = translations[currentLang].read; previousReceiptDiv = currentReceiptDiv; }
      google.script.run.withSuccessHandler(async function(payload) {
        let config = payload.uiConfig;
            if (config.appStatus === "MAINT") {
                toggleM1Maintenance(true);
                isAppSleeping = true;
            }
            else if (config.appStatus === "OFF") {
                toggleM1Maintenance(false);
                await showTypingIndicator(1000, false); appendBotMsg(translations[currentLang].stillSleepingMsg);
                sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].wakeBtn;
            } else {
                toggleM1Maintenance(false);
                isAppSleeping = false; inputField.disabled = false; sendBtn.disabled = false;
                inputField.placeholder = translations[currentLang].placeholder; sendBtn.innerText = translations[currentLang].sendBtn;
                statusDot.className = 'w-3 h-3 bg-green-500 rounded-full pulse-anim shadow-[0_0_10px_#22c55e] shrink-0';
                await showTypingIndicator(1200, false); appendBotMsg(translations[currentLang].awakeMsg); resetAfkTimer();
            }
        }).getInitialAppPayload(currentLang);
    }

let lastInputValue = ""; 
let hasSeenSecretTooltip = false; 
let tooltipCheckTimer = setInterval(() => {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen && welcomeScreen.classList.contains('hidden') && !isHotlineMode && !hasSeenSecretTooltip) {
        document.getElementById('secret-tooltip').classList.add('show');
        clearInterval(tooltipCheckTimer); 
    }
}, 500);

function hideSecretTooltip() {
    const tooltip = document.getElementById('secret-tooltip');
    if (tooltip && tooltip.classList.contains('show')) {
        tooltip.classList.remove('show');
        hasSeenSecretTooltip = true; 
    }
}

function handleInputTyping() {
    const inputEl = document.getElementById('user-input');
    const glowContainer = inputEl.closest('.input-glow-container');
    let val = inputEl.value;

    if (val === '@' || val === '@ ') {
        inputEl.value = '@Hiệp: ';
    } else if (val === '@Hiệp:' || val === '@Hiệp' || val === '@Hiệ' || val === '@Hi' || val === '@H') {
        inputEl.value = ''; 
    } else if (val.startsWith('@') && !val.startsWith('@Hiệp: ')) {
        inputEl.value = '@Hiệp: ' + val.substring(1).trimStart();
    }
    
    lastInputValue = inputEl.value;

    if (inputEl.value.startsWith('@Hiệp: ')) {
        glowContainer.classList.add('direct-msg-glow');
        inputEl.placeholder = translations[currentLang].secretPlaceholder;
    } else {
        glowContainer.classList.remove('direct-msg-glow');
        if (window.currentRealName && window.currentRealName.trim() !== "") {
            inputEl.placeholder = translations[currentLang].placeholderWithName.replace('{name}', window.currentRealName);
        } else {
            inputEl.placeholder = translations[currentLang].placeholder;
        }
    }

    if(userMessageBuffer.length > 0) {
        clearTimeout(typingTimer); clearTimeout(inputIdleTimer);
        inputIdleTimer = setTimeout(flushMessageBuffer, 7000); 
    }
    resetAfkTimer(); 
}
    async function handleChatSend() {
      if (!inputField.value.trim() || inputField.disabled) return;
      const userVal = inputField.value;
      const cmd = userVal.trim().toLowerCase();
      if (document.body.classList.contains('doraemon-mode')) {
          const forbiddenCmds = ['/zelda', '/starbucks', '/logout', '/music', '/play'];
          if (forbiddenCmds.includes(cmd)) {
              inputField.value = '';
              let warningMsg = translations[currentLang].doraWarning;
              const messages = warningMsg.split('\n');
              for (let i = 0; i < messages.length; i++) {
                  await showTypingIndicator(800 + Math.random() * 500, i > 0);
                  appendBotMsg(messages[i], i, messages.length, true);
              }
              return; 
          }
      }

      if (cmd.startsWith('/')) {
          if ((cmd === '/music' || cmd === '/play') && (isMusicPlaying || document.querySelector('.mini-player'))) {
          } else {
              clearVisualModes(false); 
          }
      }

      if (cmd === '/zelda') { inputField.value = ''; triggerZeldaEgg(); return; }
      if (cmd === '/starbucks') { inputField.value = ''; triggerStarbucksEgg(); return; }
      if (cmd === '/logout') { inputField.value = ''; triggerLogoutEgg(); return; }
      if (cmd === '/music' || cmd === '/play') { inputField.value = ''; triggerMusicEgg(); return; }
      
      inputField.value = ''; appendUserMsgToUI(userVal); userMessageBuffer.push(userVal);
      clearTimeout(typingTimer); clearTimeout(inputIdleTimer); resetAfkTimer();
      userMsgCountForSummary++;
      if (userMsgCountForSummary % 7 === 0) {
          const recentContext = chatContextHistory.slice(-12).map(m => `${m.role === 'user' ? 'Khách' : 'Peih AI'}: ${m.text}`).join('\n');
          google.script.run.doSummaryInBackground(currentSessionId, recentContext);
      }
      if (userMessageBuffer.length >= BUFFER_LIMIT) flushMessageBuffer(); 
      else {
          if (userMessageBuffer.length === BUFFER_LIMIT - 1) chatBox.insertAdjacentHTML('beforeend', `<div class="text-[10px] text-center text-gray-400 mt-1 italic">${translations[currentLang].spamWarning}</div>`);
          typingTimer = setTimeout(flushMessageBuffer, 3000); 
      }
    }

    function flushMessageBuffer() {
    if (userMessageBuffer.length === 0) return;
    clearTimeout(typingTimer); clearTimeout(inputIdleTimer);
    if (currentReceiptDiv) { currentReceiptDiv.innerText = translations[currentLang].read; previousReceiptDiv = currentReceiptDiv; }
      
    const combinedMessage = userMessageBuffer.join('\n'); userMessageBuffer = []; currentBubblesContainer = null; 
    inputField.disabled = true; sendBtn.disabled = true; sendBtn.innerText = "...";
    chatContextHistory.push({role: "user", text: combinedMessage});
    localStorage.setItem('peih_context_' + currentSessionId, JSON.stringify(chatContextHistory));
    
    const typingId = 'typing-' + Date.now();
    chatBox.insertAdjacentHTML('beforeend', `<div id="${typingId}" class="flex items-end gap-1.5 w-full mb-1 mt-4"><img src="${getAvatarUrl()}" class="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm"><div class="rounded-[24px] px-4 py-3 flex gap-1 items-center shadow-sm h-[38px]" style="background-color: var(--bot-msg-bg); border: 1px solid var(--glass-border);"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (combinedMessage.startsWith('@Hiệp: ')) {
        const realSecretMsg = combinedMessage.substring(7).trim(); 
        google.script.run.sendSecretMessage(currentSessionId, realSecretMsg, clientCity || "Không rõ", clientLat, clientLon);
        const typingEl = document.getElementById(typingId); if (typingEl) typingEl.remove();
        inputField.disabled = false; sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].sendBtn; 
        
        const glowContainer = inputField.closest('.input-glow-container');
        glowContainer.classList.remove('direct-msg-glow');
        inputField.placeholder = (window.currentRealName && window.currentRealName.trim() !== "") 
            ? translations[currentLang].placeholderWithName.replace('{name}', window.currentRealName) 
            : translations[currentLang].placeholder;

        inputField.focus(); resetAfkTimer();
        appendBotMsg(translations[currentLang].secretSuccess, 0, 1, false, false);
        return; 
    }
      
    if (isHotlineMode || isAIBlockedByAdmin) {
        google.script.run.saveChatLogToSheet(currentSessionId, 'Khách (Ống Bơ/Bị Chặn AI)', combinedMessage, clientCity || "Không rõ", clientLat, clientLon, false);
        const updateId = Date.now();
        database.ref(`chats/${currentSessionId}/${updateId}`).set({ sender: 'user', text: combinedMessage, timestamp: updateId });
        database.ref(`status/${currentSessionId}`).update({ last_active: Date.now() });

        const typingEl = document.getElementById(typingId); if (typingEl) typingEl.remove();
        inputField.disabled = false; sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].sendBtn; 
        inputField.focus(); resetAfkTimer();
        return; 
    }
    clearTimeout(failsafeTimer);
    failsafeTimer = setTimeout(() => {
        const typingEl = document.getElementById(typingId); if (typingEl) typingEl.remove(); 
        inputField.disabled = false; sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].sendBtn;
        const wrapper = document.getElementById('main-chat-wrapper');
        wrapper.classList.add('error-shake');
        setTimeout(() => wrapper.classList.remove('error-shake'), 500);
        appendBotMsg(translations[currentLang].timeoutMsg);
        chatContextHistory.pop(); 
    }, 60000); 

    const langCmds = { 
        'vi': "NGÔN NGỮ: Tiếng Việt. (Yêu cầu: Trả lời tự nhiên, ngắt dòng bằng \\n).",
        'en': "STRICT LANGUAGE: English. (Requirement: You MUST reply 100% in English. Chat naturally, use \\n for line breaks).",
        'ja': "言語規制：日本語のみ。(要求：必ず日本語で返信してください。自然な会話形式で、\\nを使用して改行してください).",
        'it': "LINGUA RIGOROSA: Italiano. (Requisito: DEVI rispondere al 100% in italiano. Chatta in modo naturale, usa \\n per le interruzioni di riga).",
        'la': "REGULA LINGUAE: Latina. (Praeceptum: Oportet te 100% Latine respondere. Loquere naturaliter, utere \\n pro novis lineis).",
        'tl': "MAHIGPIT NA WIKA: Tagalog. (Kinakailangan: DAPAT kang sumagot ng 100% sa Tagalog. Makipag-chat nang natural, gumamit ng \\n para sa mga line break).",
        'zh-tw': "嚴格語言：繁體中文。(要求：你必須100%用繁體中文回覆。自然地對話，使用 \\n 來換行)。",
        'my': "တင်းကျပ်သောဘာသာစကား: မြန်မာ။ (လိုအပ်ချက်: မြန်မာလို 100% စာပြန်ရမည်။ သဘာဝကျကျ စကားပြောပါ၊ စာကြောင်းဆင်းရန် \\n ကိုသုံးပါ)။",
        'fr': "LANGUE STRICTE : Français. (Exigence : Vous DEVEZ répondre à 100 % en français. Discutez naturellement, utilisez \\n pour les sauts de ligne).",
        'ko': "엄격한 언어: 한국어. (요구사항: 100% 한국어로 대답해야 합니다. 자연스럽게 대화하고 줄바꿈에는 \\n을 사용하세요).",
        'zh': "严格语言：简体中文。(要求：你必须100%用简体中文回复。自然地对话，使用 \\n 来换行)。",
        'es': "IDIOMA ESTRICTO: Español. (Requisito: DEBES responder 100% en español. Chatea con naturalidad, usa \\n para los saltos de línea).",
        'de': "STRIKTE SPRACHE: Deutsch. (Anforderung: Sie MÜSSEN 100% auf Deutsch antworten. Chatten Sie natürlich, verwenden Sie \\n für Zeilenumbrüche).",
        'th': "ภาษาที่บังคับ: ภาษาไทย (ข้อกำหนด: คุณต้องตอบกลับเป็นภาษาไทย 100% สนทนาอย่างเป็นธรรมชาติ ใช้ \\n สำหรับการขึ้นบรรทัดใหม่).",
        'ru': "СТРОГИЙ ЯЗЫК: Русский. (Требование: Вы ДОЛЖНЫ отвечать на 100% на русском языке. Общайтесь естественно, используйте \\n для переноса строк).",
        'ar': "لغة صارمة: العربية. (المتطلبات: يجب أن ترد بنسبة 100٪ باللغة العربية. تحدث بشكل طبيعي، استخدم \\n لفواصل الأسطر)."
    };
    let cmd = langCmds[currentLang.toLowerCase()];
    if (!cmd) {
        cmd = translations[currentLang].strictLangCmd;
        if (!cmd) {
            cmd = `STRICT LANGUAGE: ISO Code '${currentLang.toUpperCase()}'. (Requirement: You MUST reply 100% in this language. Chat naturally, use \\n for line breaks).`;
        }
    }
    
    if (isMusicPlaying) cmd += " [BỐI CẢNH ẨN: Người đang nghe bài nhạc do bạn sáng tác. Hãy chill và hỏi cảm nhận].";
    if (document.getElementById('main-chat-wrapper').classList.contains('zelda-mode')) cmd += " [BỐI CẢNH: Zelda: Tears of the Kingdom. Hyrule].";
    if (document.getElementById('main-chat-wrapper').classList.contains('starbucks-mode')) cmd += " [BỐI CẢNH: Starbucks Reserve].";
      
    const now = new Date();
    const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    let h = now.getHours();
    let buoi = h < 11 ? "Sáng" : (h < 14 ? "Trưa" : (h < 18 ? "Chiều" : (h < 22 ? "Tối" : "Đêm")));
    const clientTime = `${buoi} - ${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}, ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} (${dayNames[now.getDay()]})`;
    const clientContext = { time: clientTime, lat: clientLat, lon: clientLon, city: clientCity, isDoraemon: document.body.classList.contains('doraemon-mode') };
    google.script.run.withSuccessHandler(async function(botResponse) {
        clearTimeout(failsafeTimer);
        const typingEl = document.getElementById(typingId); if (typingEl) typingEl.remove();
        if (botResponse.includes("TRIGGER_STARBUCKS")) { botResponse = botResponse.replace(/TRIGGER_STARBUCKS\|?/g, ""); triggerStarbucksEgg(true); }
        else if (botResponse.includes("TRIGGER_ZELDA")) { botResponse = botResponse.replace(/TRIGGER_ZELDA\|?/g, ""); triggerZeldaEgg(true); }
        else if (botResponse.includes("TRIGGER_MUSIC")) { botResponse = botResponse.replace(/TRIGGER_MUSIC\|?/g, ""); triggerMusicEgg(true); }
        else if (botResponse.includes("TRIGGER_BLUR")) { botResponse = botResponse.replace(/TRIGGER_BLUR\|?/g, ""); triggerBlurEgg(true); }

        if (botResponse.startsWith("RECALL_TRIGGER|")) {
            botResponse = botResponse.replace("RECALL_TRIGGER|", "");
            if (chatContextHistory.length > 0) {
                for (let i = chatContextHistory.length - 1; i >= 0; i--) {
                    if (chatContextHistory[i].role === 'user') { chatContextHistory[i].text = translations[currentLang].toxicRecalled; break; }
                }
                localStorage.setItem('peih_context_' + currentSessionId, JSON.stringify(chatContextHistory));
            }
            const userGroups = chatBox.querySelectorAll('.user-msg-group');
            if (userGroups.length > 0) {
                const lastGroup = userGroups[userGroups.length - 1];  
                lastGroup.classList.add('poof-animation');        
                setTimeout(() => {
                    lastGroup.classList.remove('poof-animation'); lastGroup.style.opacity = "1"; lastGroup.style.transform = "none";              
                    lastGroup.innerHTML = `<div class="msg-recalled" style="margin-left: auto; margin-right: 0; text-align: right;">${translations[currentLang].toxicRecalled}</div>`;
                }, 400); 
            }
        }
        if (botResponse === "SYSTEM_MAINTENANCE_MODE") {
            toggleM1Maintenance(true);
            isAppSleeping = true;
            chatContextHistory.pop(); 
            return; 
        }
        if (botResponse === "SYSTEM_SLEEP_MODE") {
            isAppSleeping = true; inputField.disabled = true; sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].wakeBtn;
            statusDot.className = 'w-3 h-3 bg-red-500 rounded-full shrink-0';
            await showTypingIndicator(1000, false); appendBotMsg(translations[currentLang].sleepyMsg1, 0, 2);
            await showTypingIndicator(1500, true); appendBotMsg(translations[currentLang].sleepyMsg2, 1, 2);
            setTimeout(() => { appendSystemMsg(translations[currentLang].sleepMsg); }, 1200);
            chatContextHistory.pop(); return; 
        }

        const messages = botResponse.replace(/\\n/g, '\n').replace(/\\/g, '').split('\n').filter(msg => msg.trim() !== '');
        for (let i = 0; i < messages.length; i++) { 
            if (i > 0) await showTypingIndicator(800 + Math.random() * 800, true); 
            appendBotMsg(messages[i], i, messages.length, false, false); 
        }
          
        chatContextHistory.push({role: "model", text: botResponse}); if(chatContextHistory.length > 30) chatContextHistory = chatContextHistory.slice(-30);
        localStorage.setItem('peih_context_' + currentSessionId, JSON.stringify(chatContextHistory));
        inputField.disabled = false; sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].sendBtn; inputField.focus(); resetAfkTimer();

        setTimeout(() => {
            google.script.run.saveChatLogToSheet(currentSessionId, 'Peih AI', botResponse, clientCity || "Không rõ", clientLat, clientLon, false);
        }, 1000);

        if (userMsgCountForSummary % 7 === 0) {
            setTimeout(() => {
                const recentContext = chatContextHistory.slice(-12).map(m => `${m.role === 'user' ? 'Khách' : 'Peih AI'}: ${m.text}`).join('\n');
                google.script.run.doSummaryInBackground(currentSessionId, recentContext);
            }, 3000);
        }
    }).withFailureHandler(function() {
        clearTimeout(failsafeTimer);
        const typingEl = document.getElementById(typingId); if (typingEl) typingEl.remove();
        const wrapper = document.getElementById('main-chat-wrapper');
        wrapper.classList.add('error-shake');
        setTimeout(() => wrapper.classList.remove('error-shake'), 500);
        appendBotMsg(translations[currentLang].offlineMsg); chatContextHistory.pop();
        inputField.disabled = false; sendBtn.disabled = false; sendBtn.innerText = translations[currentLang].sendBtn; 
    }).getBotResponse(currentSessionId, chatContextHistory, cmd, currentLang, clientContext, currentPersonalityName); 
    
    
    const userUpdateId = Date.now();
    database.ref(`chats/${currentSessionId}/${userUpdateId}`).set({ sender: 'user', text: combinedMessage, timestamp: userUpdateId });
    database.ref(`status/${currentSessionId}`).update({ last_active: Date.now() });

    
    setTimeout(() => {
        google.script.run.saveChatLogToSheet(currentSessionId, 'Khách', combinedMessage, clientCity || "Không biết", clientLat, clientLon, false);
    }, 50);
}

    function submitBooking() {
        const name = document.getElementById('book-name').value;
        const date = document.getElementById('book-date').value;
        const time = document.getElementById('book-time').value;
        const note = document.getElementById('book-note').value;

        if(!name || !date || !time) {
            alert(translations[currentLang].bookAlert);
            return;
        }

        const bookContent = document.getElementById('leather-book-content');
        bookContent.classList.add('signing'); 

        const bookingText = `🔔 YÊU CẦU ĐẶT LỊCH:\n- Tên: ${name}\n- Thời gian: ${time} ngày ${date}\n- Lời nhắn: ${note}`;
        google.script.run.saveChatLogToSheet(currentSessionId, 'BOOKING', bookingText, "Form Đặt Lịch", null, null);

        setTimeout(() => {
            bookContent.classList.add('book-fly'); 
            
            setTimeout(() => {
                document.getElementById('booking-modal').classList.remove('open');
                appendBotMsg(translations[currentLang].bookSuccess.replace('{name}', name).replace('{time}', time).replace('{date}', date), 0, 1, true);
            }, 1000);
        }, 1500); 
    }
window.cachedThreadsData = null; 
let currentThreadsPage = 1; 
let isFetchingThreads = false; 
let hasMoreThreads = true; 
let isThreadsAnimating = false;

function toggleThreads() {
    if (isThreadsAnimating) return; 
    isThreadsAnimating = true;

    const body = document.body;
    const floatBtn = document.getElementById('floating-back-btn');

    if (!body.classList.contains('threads-active')) {
        body.classList.add('threads-active');
        if (!window.cachedThreadsData) loadThreadsData();
        else renderThreadsList(window.cachedThreadsData);
        
        const feed = document.getElementById('threads-feed');
        if (feed) feed.scrollTop = 0;
        setTimeout(() => { isThreadsAnimating = false; }, 400); 
    } else {

        body.classList.remove('threads-active');
        body.classList.add('threads-closing'); 
        
        if (floatBtn) {
            floatBtn.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
            floatBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        }

        setTimeout(() => {
            body.classList.remove('threads-closing');
            isThreadsAnimating = false;
        }, 400);
    }
}
    function handleThreadsScroll() {
        if (!document.body.classList.contains('threads-active')) return;
        const floatBtn = document.getElementById('floating-back-btn');
        if (!floatBtn) return;
        const feed = document.getElementById('threads-feed');
        const scrollPos = (window.innerWidth < 1024) ? window.scrollY : (feed ? feed.scrollTop : 0);

        if (scrollPos > 150) {
            floatBtn.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
            floatBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
            floatBtn.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
            floatBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        }
    }

    window.addEventListener('scroll', handleThreadsScroll);
    document.addEventListener('DOMContentLoaded', () => {
        const feed = document.getElementById('threads-feed');
        if (feed) feed.addEventListener('scroll', handleThreadsScroll);
    });

const feedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            const videos = entry.target.querySelectorAll('video');
            videos.forEach(v => v.pause());
        }
    });
}, {
    root: document.getElementById('threads-feed'),
    rootMargin: '1000px 0px 1000px 0px'
});

function observeNewPosts() {
    const unobservedPosts = document.querySelectorAll('.thread-post-wrapper:not(.observed)');
    unobservedPosts.forEach(post => {
        feedObserver.observe(post);
        post.classList.add('observed');
    });
}

function loadThreadsData() {
    const feed = document.getElementById('threads-feed');
    
    feed.innerHTML = `
        <div class="flex flex-col gap-6 pt-4 animate-pulse px-2">
            <div class="flex gap-3"><div class="w-10 h-10 bg-gray-400/30 rounded-full"></div><div class="flex-1 space-y-2 py-1"><div class="h-4 bg-gray-400/30 rounded w-1/4"></div><div class="h-3 bg-gray-400/30 rounded w-5/6"></div><div class="h-32 bg-gray-400/30 rounded-xl mt-3 w-full"></div></div></div>
            <div class="flex gap-3"><div class="w-10 h-10 bg-gray-400/30 rounded-full"></div><div class="flex-1 space-y-2 py-1"><div class="h-4 bg-gray-400/30 rounded w-1/3"></div><div class="h-3 bg-gray-400/30 rounded w-4/5"></div></div></div>
        </div>`;
    
    google.script.run.withSuccessHandler(function(payload) {
        window.cachedThreadsData = payload.threadsData;
        hasMoreThreads = payload.hasMore; 
        currentThreadsPage = 1; 
        
        renderThreadsList(payload.threadsData, false);
    }).withFailureHandler(function(error) {
        feed.innerHTML = `<div class="text-center py-10 text-red-500 text-sm">${translations[currentLang].threadError}</div>`;
    }).getInitialAppPayload(currentLang); 
}

function renderThreadsList(data, isAppend = false) {
    const feed = document.getElementById('threads-feed');
    const emptyMsg = feed.querySelector('.italic');
    const oldSpinner = document.getElementById('threads-more-loader');
    const oldEndMsg = document.getElementById('threads-end-msg');
    
    if (emptyMsg) emptyMsg.remove();
    if (oldSpinner) oldSpinner.remove();
    if (oldEndMsg) oldEndMsg.remove();
    
    if (!isAppend) feed.innerHTML = ''; 

    if (!data || data.length === 0) {
        if (!isAppend) feed.insertAdjacentHTML('beforeend', `<div class="text-center py-16 text-gray-500 text-sm italic">${translations[currentLang].threadEmpty}</div>`);
        return;
    }

    if (isAppend) {
        const wrappers = feed.querySelectorAll('.thread-post-wrapper');
        if (wrappers.length > 0) {
            const lastWrapper = wrappers[wrappers.length - 1];
            const avatarCol = lastWrapper.querySelector('.flex-col.items-center');
            const contentCol = lastWrapper.querySelector('.flex-1');
            
            if (avatarCol && !avatarCol.querySelector('.thread-line')) {
                avatarCol.insertAdjacentHTML('beforeend', `<div class="thread-line"></div>`);
            }
            if (contentCol) {
                contentCol.classList.add('border-b', 'border-gray-300/20');
            }
        }
    }

    let htmlStr = '';
    data.forEach((post, index) => {
        const isLastPost = (index === data.length - 1);
        htmlStr += buildThreadPost(post, isLastPost);
    });
    feed.insertAdjacentHTML('beforeend', htmlStr);

    if (hasMoreThreads) {
        feed.insertAdjacentHTML('beforeend', `
            <div id="threads-more-loader" class="flex flex-col items-center py-8">
                <div class="w-6 h-6 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                <span class="text-[12px] text-gray-400 mt-2 font-medium">${translations[currentLang].threadLoadingMore}</span>
            </div>
        `);
    } else if (isAppend && data.length > 0) {
        feed.insertAdjacentHTML('beforeend', `<div id="threads-end-msg" class="text-center py-8 text-[12px] text-gray-400 italic">${translations[currentLang].threadEndOfFeed}</div>`);
    }

    observeNewPosts();
}

function formatCount(num) {
    if (!num || num === 0) return '';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}
function buildThreadPost(post, isLast) {
    const avatar = getAvatarUrl();
    
    const pinHtml = post.isPinned ? `<div class="text-[12px] text-gray-500 font-medium mb-1.5 flex items-center gap-1.5"><svg class="w-[14px] h-[14px]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg> ${translations[currentLang].threadPinned}</div>` : '';
    
    let mediaHtml = '';
if (post.media && post.media.length > 0) {
    const onLoadLogic = "this.classList.remove('img-loading'); this.classList.add('img-loaded', this.naturalWidth >= this.naturalHeight ? 'img-landscape' : 'img-portrait');";

    if (post.media.length === 1) {
        const m = post.media[0];
        if (m.type === 'video') {
            mediaHtml = `<video controls playsinline preload="none" class="w-full mt-2.5 rounded-[12px] border border-gray-200/20 shadow-sm bg-black"><source src="${m.url}" type="video/mp4"></video>`;
        } else {
            mediaHtml = `<img src="${m.url}" loading="lazy" decoding="async" onload="${onLoadLogic}" class="img-loading single-img object-cover rounded-[12px] border border-gray-200/20 shadow-sm">`;
        }
    } else {
        let items = post.media.map(m => `<img src="${m.url}" loading="lazy" decoding="async" onload="${onLoadLogic}" class="img-loading thread-carousel-item object-cover rounded-[12px] border border-gray-200/20 shadow-sm">`).join('');
        mediaHtml = `<div class="thread-carousel mt-2.5 items-center" ontouchstart="this.style.scrollSnapType='x mandatory'" onmouseenter="this.style.scrollSnapType='x mandatory'">${items}</div>`;
    }
}

    const lineHtml = isLast ? '' : `<div class="thread-line"></div>`;
    const borderBottomClass = isLast ? '' : 'border-b border-gray-300/20';

    return `
    <div class="thread-post-wrapper">
        <div class="flex gap-2 pt-3">
            <div class="flex flex-col items-center pt-1 z-10 shrink-0" style="width: 44px;">
                <img src="${avatar}" class="w-9 h-9 rounded-full object-cover shadow-sm shrink-0" style="border: 1px solid var(--glass-border);">
          ${lineHtml}
        </div>
        
        <div class="flex-1 pb-4 ${borderBottomClass} min-w-0"> 
            ${pinHtml}
            <div class="flex justify-between items-baseline mb-0.5">
                <div class="font-bold text-[15px] flex items-center gap-1" style="color: var(--text-main);">
                    Peih 
                    <svg class="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <span class="text-[13px] text-gray-400 shrink-0">${post.date}</span>
            </div>
            <p class="text-[15px] leading-relaxed whitespace-pre-wrap" style="color: var(--text-main);"><span id="thread-text-content-${post.rowIndex}">${post.text}</span>${post.text ? ` <span id="thread-trans-btn-${post.rowIndex}" onclick="translateThread(${post.rowIndex})" class="inline-block cursor-pointer ml-1 text-[13px] font-medium opacity-60 hover:opacity-100 transition-opacity whitespace-nowrap select-none" style="color: var(--text-sub);">${{'vi':'Dịch','en':'Translation','ja':'翻訳','it':'Traduci','la':'Interpretari','tl':'I-translate','zh-tw':'翻譯','my':'ဘာသာပြန်','fr':'Traduire','ko':'번역','zh':'翻译','es':'Traducir','de':'Übersetzen','th':'แปล','ru':'Перевести','ar':'ترجمة'}[currentLang] || 'Translation'}</span>` : ''}</p>
            
            ${mediaHtml}
            
            ${(function() {
                const isLiked = localStorage.getItem(`liked_thread_${post.rowIndex}`) ? true : false;
                const likeColorClass = isLiked ? 'text-red-500' : 'hover:text-red-500 text-gray-500';
                const likeFill = isLiked ? 'currentColor' : 'none';
                
                return `
                <div class="flex gap-5 mt-3.5 opacity-80 items-center">
                    <div class="flex items-center gap-1.5 cursor-pointer ${likeColorClass} transition-colors" onclick="handleThreadLike(this, ${post.rowIndex})">
                        <svg class="w-[20px] h-[20px]" fill="${likeFill}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span class="text-[13px] font-medium like-count">${formatCount(post.likes)}</span>
                    </div>
                    
                    <div class="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 text-gray-500 transition-colors" onclick="handleThreadComment(this, ${post.rowIndex})">
                        <svg class="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        <span class="text-[13px] font-medium cmt-count">${formatCount(post.comments)}</span>
                    </div>
                </div>`;
            })()}

             <div id="comment-section-${post.rowIndex}" class="comment-collapse">
                <div> <div id="comment-list-${post.rowIndex}" class="flex flex-col gap-2 mb-3 empty:hidden pl-1"></div>
                    
                    <div class="flex items-center gap-2 pl-1 relative z-10">
                    <div class="w-6 h-6 rounded-full bg-gray-500/20 flex items-center justify-center shrink-0 border border-gray-500/20">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    
                    <input type="text" id="comment-input-${post.rowIndex}" placeholder="${translations[currentLang].threadCommentPlaceholder}"
                           enterkeyhint="send"
                           class="flex-1 bg-transparent border border-gray-500/30 rounded-[20px] px-3 py-1.5 outline-none focus:border-blue-500 transition-colors" 
                           style="color: var(--text-main); font-size: 16px !important; appearance: none; -webkit-appearance: none; transform: translateZ(0);" 
                           onkeypress="if(event.key === 'Enter') { event.preventDefault(); submitInlineComment(${post.rowIndex}); }">
                           
                    <button onclick="submitInlineComment(${post.rowIndex})" class="text-blue-500 font-bold text-[13px] px-1 shrink-0 hover:opacity-70 transition-opacity">${translations[currentLang].threadSendBtn}</button>
                  </div>
                </div>
             </div>
          </div>
        </div>
    </div>
    `;
}

function handleThreadLike(element, rowIndex) {
    const storageKey = `liked_thread_${rowIndex}`;
    if (localStorage.getItem(storageKey)) return; 
    localStorage.setItem(storageKey, 'true');
    element.classList.remove('hover:text-red-500', 'text-gray-500');
    element.classList.add('text-red-500');
    const svg = element.querySelector('svg');
    if (svg) {
        svg.setAttribute('fill', 'currentColor');
        svg.style.transform = 'scale(1.3)';
        setTimeout(() => svg.style.transform = 'scale(1)', 200);
    }
    const countSpan = element.querySelector('.like-count');
    if (countSpan) {
        let newLikes = 1; 
        
        if (window.cachedThreadsData) {
            let post = window.cachedThreadsData.find(p => p.rowIndex === rowIndex);
            if (post) {
                post.likes = (Number(post.likes) || 0) + 1; 
                newLikes = post.likes;
            }
        } else {
            let currentText = countSpan.innerText.replace(/k/gi, '000').replace(/M/gi, '000000');
            newLikes = (Number(currentText) || 0) + 1;
        }
        countSpan.innerText = formatCount(newLikes);
    }
    if (typeof google !== 'undefined') {
        google.script.run.addThreadLike(rowIndex);
    }
}

function handleThreadComment(element, rowIndex) {
    const section = document.getElementById(`comment-section-${rowIndex}`);
    const input = document.getElementById(`comment-input-${rowIndex}`);
    
    if (section) {
        if (section.classList.contains('comment-collapse')) {
            section.classList.remove('comment-collapse');
            section.classList.add('comment-expand');
            element.classList.remove('text-gray-500');
            element.classList.add('text-blue-500');
            setTimeout(() => input.focus({ preventScroll: true }), 300);
        } else {
            section.classList.remove('comment-expand');
            section.classList.add('comment-collapse');
            element.classList.remove('text-blue-500');
            element.classList.add('text-gray-500');
        }
    }
}

function submitInlineComment(rowIndex) {
    const input = document.getElementById(`comment-input-${rowIndex}`);
    const text = input.value.trim();
    if (!text) { input.focus(); return; }

    input.blur(); 

    const list = document.getElementById(`comment-list-${rowIndex}`);
    const newCommentHtml = `
        <div class="flex gap-2 items-start animate-fade-in">
            <div class="w-6 h-6 rounded-full bg-gray-500/20 flex items-center justify-center shrink-0 border border-gray-500/20 mt-0.5">
                <svg class="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div class="flex-1 bg-gray-500/10 rounded-[14px] rounded-tl-sm px-3.5 py-2 text-[13.5px] leading-snug w-fit max-w-[85%]" style="color: var(--text-main);">
                <span class="opacity-90">${escapeHTML(text)}</span>
            </div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', newCommentHtml);
    input.value = '';
    if (window.cachedThreadsData) {
        let post = window.cachedThreadsData.find(p => p.rowIndex === rowIndex);
        if (post) {
            post.comments += 1;
            const cmtCountEl = input.closest('.thread-post-wrapper').querySelector('.cmt-count');
            if(cmtCountEl) cmtCountEl.innerText = formatCount(post.comments);
        }
    }
    google.script.run.addThreadComment(rowIndex, text, currentSessionId);
    const typingId = `ai-typing-${Date.now()}`;
    const typingHtml = `
        <div id="${typingId}" class="flex gap-2 items-start animate-fade-in relative ml-8 mt-1">
            <div class="reply-connector"></div>
            <img src="${getAvatarUrl()}" class="w-5 h-5 rounded-full object-cover shrink-0 shadow-sm border border-gray-500/20">
            <div class="bg-blue-500/10 rounded-[12px] rounded-tl-sm px-3 flex gap-1 items-center h-[24px]">
                <div class="typing-dot w-1 h-1"></div><div class="typing-dot w-1 h-1"></div><div class="typing-dot w-1 h-1"></div>
            </div>
        </div>
    `;
    list.insertAdjacentHTML('beforeend', typingHtml);
    google.script.run.withSuccessHandler(function(aiReply) {
        const tEl = document.getElementById(typingId);
        if (tEl) tEl.remove(); 
        
        if (aiReply) {
            const aiCommentHtml = `
                <div class="flex gap-2 items-start animate-fade-in relative ml-8 mt-1">
                    <div class="reply-connector"></div>
                    <img src="${getAvatarUrl()}" class="w-5 h-5 rounded-full object-cover shrink-0 shadow-sm border border-gray-500/20 mt-0.5">
                    <div class="flex-1 bg-blue-500/5 border border-blue-500/20 rounded-[14px] rounded-tl-sm px-3.5 py-2 text-[13.5px] leading-snug w-fit max-w-[90%]" style="color: var(--text-main);">
                        <span class="font-bold mr-1 text-blue-500 text-[12.5px]">Peih</span>
                        <span class="opacity-90">${escapeHTML(aiReply)}</span>
                    </div>
                </div>
            `;
            list.insertAdjacentHTML('beforeend', aiCommentHtml);
        }
    }).generateCommentReply(rowIndex, text, currentLang);
}

function toggleLangMenu() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('dropdown-anim');
    } else {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('dropdown-anim');
    }
}

function selectLang(langCode, displayText) {
    document.getElementById('current-lang-display').innerText = displayText;
    document.getElementById('lang-dropdown').classList.add('hidden');
    document.getElementById('lang-dropdown').classList.remove('dropdown-anim');
    changeLang(langCode);
}

function openLangModal() {
    document.getElementById('lang-dropdown').classList.add('hidden');
    document.getElementById('lang-dropdown').classList.remove('dropdown-anim');
    const modal = document.getElementById('lang-modal-overlay');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
}

function closeLangModal() {
    const modal = document.getElementById('lang-modal-overlay');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

function submitManualLanguage() {
    const inputEl = document.getElementById('manual-lang-input');
    const code = inputEl.value.trim().toLowerCase();
    if (!code) return;
    requestCustomLanguage(code, '🌐 ' + code.toUpperCase());
    inputEl.value = '';
}

async function requestCustomLanguage(targetLang, displayName) {
    closeLangModal();

    let finalLang = targetLang.trim().toLowerCase();
    const pill = document.getElementById('trans-pill');
    const pillText = document.getElementById('pill-text');
    const pillProg = document.getElementById('pill-progress');

    window.isAutoFetchingLang = true;

    let isFromModal = displayName && !displayName.startsWith('🌐');

    if (isFromModal) {
        window.customTempFlag = displayName.split(' ')[0]; 
        localStorage.setItem('peih_custom_flag_' + finalLang, window.customTempFlag);
    } else {
        if (pill) {
            pillText.innerHTML = "Identifying language...";
            pillProg.style.width = "50%";
            pill.classList.remove('hidden');
            pill.classList.add('flex');
            setTimeout(() => { pill.classList.add('scale-100', 'opacity-100'); }, 10);
        }
        
        let detected = await new Promise(resolve => {
            google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(() => resolve({code: 'en', flag: '🇺🇸'}))
                .aiDetectLanguageCode(finalLang);
        });
        finalLang = detected.code;
        window.customTempFlag = detected.flag;
        localStorage.setItem('peih_custom_flag_' + finalLang, detected.flag);
    }

    if (translations[finalLang]) {
        if (pill) { pill.classList.add('hidden'); pill.classList.remove('flex', 'opacity-100'); }
        window.isAutoFetchingLang = false;
        changeLang(finalLang);
        return;
    }

    const loadingMap = {
        'it': 'Caricamento delle lingue',
        'la': 'Linguae instruuntur',
        'tl': 'Kinakarga ang mga wika',
        'zh-tw': '正在載入語言',
        'my': 'ဘာသာစကားများကို တင်နေသည်',
        'fr': 'Chargement des langues',
        'ko': '언어 로딩 중',
        'zh': '正在加载语言',
        'es': 'Cargando idiomas',
        'de': 'Sprachen werden geladen',
        'th': 'กำลังโหลดภาษา',
        'ru': 'Загрузка языков',
        'ar': 'جار تحميل اللغات'
    };
    if (pill) {
        pillText.innerHTML = (loadingMap[finalLang] || "Loading") + "...";
        pill.classList.remove('hidden');
        pill.classList.add('flex');
        setTimeout(() => { pill.classList.add('scale-100', 'opacity-100'); pillProg.style.width = "80%"; }, 10);
    }

    google.script.run.withSuccessHandler(function(package) {
        if (package.error) {
            window.isAutoFetchingLang = false;
            if (pill) { pill.classList.add('hidden'); pill.classList.remove('flex', 'opacity-100'); }
            return;
        }

        translations[finalLang] = package.ui;
        translations[finalLang].customFlag = package.flag || window.customTempFlag;
        
        if (package.quotes) {
            package.quotes.forEach((text, idx) => { if (quotes[idx]) quotes[idx][finalLang] = text; });
        }
        if (package.doraQuotes) {
            package.doraQuotes.forEach((text, idx) => { if (doraQuotes[idx]) doraQuotes[idx][finalLang] = text; });
        }

        if (pill) {
            pillProg.style.width = "100%";
            pillText.innerHTML = "✓ DONE";
            pillText.style.color = "#22c55e";
            setTimeout(() => {
                pill.classList.replace('scale-100', 'scale-90');
                pill.classList.remove('opacity-100');
                setTimeout(() => {
                    pill.classList.add('hidden');
                    pill.classList.remove('flex');
                    pillText.style.color = "var(--bot-msg-bg)";
                    window.isAutoFetchingLang = false; 
                    changeLang(finalLang);
                }, 300);
            }, 600);
        } else {
            window.isAutoFetchingLang = false;
            changeLang(finalLang);
        }
    }).withFailureHandler(function() {
        window.isAutoFetchingLang = false;
        if (pill) { pill.classList.add('hidden'); pill.classList.remove('flex', 'opacity-100'); }
    }).translateFullPackage(finalLang, window.customTempFlag);
}

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('lang-dropdown');
    if (!dropdown) return;
    
    const toggleBtn = dropdown.previousElementSibling; 
    
    if (!dropdown.contains(e.target) && !toggleBtn.contains(e.target)) {
        if (!dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
            dropdown.classList.remove('dropdown-anim');
        }
    }
});
    window.addEventListener('online', () => {
        if (window.isSystemHalted) {
            inputField.placeholder = translations[currentLang].reconnecting;
            google.script.run.withSuccessHandler(async function(payload) {
                window.isSystemHalted = false; 
                const sysBubbles = document.querySelectorAll('.system-bubble');
                sysBubbles.forEach(b => { if (b.innerText.includes("⚠️")) b.remove(); });
                
                let config = payload.uiConfig;
                globalUIConfig = config;
      
                if (config.appStatus === "LOCK") {
                    inputField.disabled = true;
                    sendBtn.disabled = true;
                    
                    const savageBypass = {
                        vi: "Tính rút cáp mạng để lách luật hả? Peih biết hết nha hacker lỏ! 😎 Đang đóng gói đưa bạn ra ngoài trong 7 giây...",
                        en: "Trying to bypass by cutting the network? Nice try! 😎 Kicking you out in 7 seconds...",
                        ja: "ネットワークを切ってバイパスしようとした？お見通しですよ！😎 7秒後に退出させます..."
                    };
                    
                    const sysBubbles = document.querySelectorAll('.system-bubble');
                    sysBubbles.forEach(b => { if (b.innerText.includes("⚠️")) b.remove(); });
  
                    appendBotMsg(savageBypass[currentLang] || savageBypass['vi'], 0, 1, false, false);
                    setTimeout(() => {
                        document.getElementById('welcome-screen').classList.remove('hidden');
                        const gate = document.getElementById('gatekeeper-screen');
                        if(gate) {
                            gate.classList.remove('hidden');
                            gate.classList.add('flex');
                            setTimeout(() => gate.classList.remove('opacity-0'), 50);
                        }
                        
                        const appContainer = document.querySelector('.app-container');
                        if (appContainer) appContainer.remove(); 
                        document.body.style.overflow = 'hidden';
                    }, 7500);
                    
                    return; 
                }
                
                if(config.appStatus === "MAINT") {
                     toggleM1Maintenance(true);
                     isAppSleeping = true;
                } 
                else if(config.appStatus === "OFF") {
                     toggleM1Maintenance(false);
                     isAppSleeping = true; 
                     inputField.disabled = true; 
                     sendBtn.disabled = false; 
                     sendBtn.innerText = translations[currentLang].wakeBtn;
                     inputField.placeholder = translations[currentLang].sleepPlaceholder; 
                     statusDot.className = 'w-3 h-3 bg-red-500 rounded-full shrink-0';
                     await showTypingIndicator(1000, false); appendBotMsg(translations[currentLang].sleepyMsg1, 0, 2);
                     await showTypingIndicator(1500, true); appendBotMsg(translations[currentLang].sleepyMsg2, 1, 2);
                     setTimeout(() => { appendSystemMsg(translations[currentLang].sleepMsg); }, 1200);
                } else {
                     toggleM1Maintenance(false);
                     inputField.disabled = false; 
                     sendBtn.disabled = false;
                     sendBtn.innerText = translations[currentLang].sendBtn;
                     statusDot.className = 'w-3 h-3 bg-green-500 rounded-full pulse-anim shadow-[0_0_10px_#22c55e] shrink-0';

                     if (window.currentRealName && window.currentRealName.trim() !== "") {
                         inputField.placeholder = translations[currentLang].placeholderWithName.replace('{name}', window.currentRealName);
                     } else {
                         inputField.placeholder = translations[currentLang].placeholder;
                     }
                     
                     if(chatContextHistory.length === 0) {
                         inputField.disabled = true; 
                         sendBtn.disabled = true; 
                         startAutoChat(); 
                     }
                }
            }).withFailureHandler(function() {
                inputField.placeholder = translations[currentLang].reconnectFailed;
            }).getInitialAppPayload(currentLang);
        }
    });

let currentStoryList = [];
let currentStoryIndex = 0;
let storyTimer;
const STORY_DURATION = 5000; 

function loadDailyStories() {
    google.script.run.withSuccessHandler(function(stories) {
        if (!stories || stories.length === 0) return;
        
        const currentHour = new Date().getHours();
        const dateString = new Date().toDateString();

        currentStoryList = stories.map(item => {
            let timeAgo = currentHour - item.publishHour;
            if (timeAgo < 0) timeAgo += 24; 
            return { ...item, timeText: timeAgo === 0 ? '1m' : `${timeAgo}h` };
        });

        if (currentStoryList.length > 0) {
            setTimeout(() => {
                const firstItem = currentStoryList[0];
                if (firstItem.type === 'video') {
                    const v = document.createElement('video');
                    v.preload = 'auto';
                    v.src = firstItem.url;
                } else {
                    new Image().src = firstItem.url;
                }
            }, 2500);
        }

        const lastViewed = sessionStorage.getItem('peih_story_viewed');
        const ring = document.getElementById('profile-avatar-ring');
        
        if (ring) {
            ring.classList.remove('story-ring-active', 'story-ring-viewed');
            if (lastViewed === dateString) {
                ring.classList.add('story-ring-viewed');
            } else {
                ring.classList.add('story-ring-active');
            }
        }
    }).getDailyStories();
}

function openStory() {
    if (!document.body.classList.contains('threads-active')) return; 
    if (currentStoryList.length === 0) return; 

    const logoutOverlay = document.getElementById('logout-overlay');
    if (logoutOverlay && logoutOverlay.classList.contains('active')) return;

    const bgAudio = document.getElementById('bg-audio');
    if (bgAudio && !bgAudio.paused) bgAudio.pause();

    const modal = document.getElementById('story-viewer-modal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    
    currentStoryIndex = 0;
    renderStoryProgressBars();
    showStoryItem(currentStoryIndex);

    sessionStorage.setItem('peih_story_viewed', new Date().toDateString());
    const ring = document.getElementById('profile-avatar-ring');
    if (ring) {
        ring.classList.remove('story-ring-active');
        ring.classList.add('story-ring-viewed');
    }
}

function closeStory() {
    clearTimeout(storyTimer);
    const modal = document.getElementById('story-viewer-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
    const vid = document.getElementById('story-vid-viewer');
    if (vid) {
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
        vid.classList.add('hidden');
    }
    const img = document.getElementById('story-img-viewer');
    if (img) img.classList.add('hidden');
}

function renderStoryProgressBars() {
    const container = document.getElementById('story-progress-container');
    if (!container) return;
    container.innerHTML = currentStoryList.map((_, i) => `
        <div class="story-progress-bar">
            <div id="story-fill-${i}" class="story-progress-fill transition-none"></div>
        </div>
    `).join('');
}

function showStoryItem(index) {
    clearTimeout(storyTimer);
    const item = currentStoryList[index];
    document.getElementById('story-time').innerText = item.timeText;

    for (let i = 0; i < currentStoryList.length; i++) {
        const fill = document.getElementById(`story-fill-${i}`);
        if (fill) {
            fill.style.transition = 'none';
            fill.style.width = i < index ? '100%' : '0%';
        }
    }

    const imgEl = document.getElementById('story-img-viewer');
    const vidEl = document.getElementById('story-vid-viewer');

    if (item.type === 'video') {
        imgEl.classList.add('hidden');
        vidEl.classList.remove('hidden');
        
        vidEl.oncanplay = null;
        vidEl.onerror = null;

        const startVideoTimer = () => {
            vidEl.play().catch(e => {});
            animateProgressBar(index, vidEl.duration * 1000);
            storyTimer = setTimeout(() => nextStory(), vidEl.duration * 1000);
        };

        vidEl.oncanplay = () => {
            vidEl.oncanplay = null;
            startVideoTimer();
        };
        
        vidEl.src = item.url;
        vidEl.load();
        
        if (vidEl.readyState >= 3) {
            vidEl.oncanplay = null;
            startVideoTimer();
        }
    } else {
        vidEl.pause();
        vidEl.removeAttribute('src');
        vidEl.load();
        vidEl.classList.add('hidden');
        
        imgEl.classList.remove('hidden');
        imgEl.onload = null;
        imgEl.onerror = null;

        const startImageTimer = () => {
            animateProgressBar(index, STORY_DURATION);
            storyTimer = setTimeout(() => nextStory(), STORY_DURATION);
        };

        imgEl.onload = () => {
            imgEl.onload = null;
            startImageTimer();
        };

        imgEl.onerror = () => {
            imgEl.onerror = null;
            startImageTimer();
        };

        imgEl.src = item.url;

        if (imgEl.complete) {
            imgEl.onload = null;
            startImageTimer();
        }
    }
    
    if (index < currentStoryList.length - 1) {
        setTimeout(() => {
            const nextItem = currentStoryList[index + 1];
            if (nextItem.type === 'video') {
                const v = document.createElement('video');
                v.preload = 'auto';
                v.src = nextItem.url;
            } else {
                new Image().src = nextItem.url;
            }
        }, 1000);
    }
}
function animateProgressBar(index, duration) {
    const fill = document.getElementById(`story-fill-${index}`);
    if (fill) {
        fill.style.transition = 'none';
        fill.style.width = '0%';
        
        void fill.offsetWidth;
        
        fill.style.transition = `width ${duration}ms linear`;
        fill.style.width = '100%';
    }
}

function nextStory() {
    if (currentStoryIndex < currentStoryList.length - 1) {
        currentStoryIndex++;
        showStoryItem(currentStoryIndex);
    } else {
        closeStory();
    }
}

function prevStory() {
    if (currentStoryIndex > 0) {
        currentStoryIndex--;
        showStoryItem(currentStoryIndex);
    } else {
        showStoryItem(currentStoryIndex); 
    }
}
function checkAndLoadMore() {
    if(isFetchingThreads || !hasMoreThreads || !document.body.classList.contains('threads-active')) return;
    const feed = document.getElementById('threads-feed');
    if(!feed) return;
    let isBottom = false;
    if(window.innerWidth < 1024) {
        isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 250);
    } else {
        isBottom = (feed.scrollHeight - feed.scrollTop - feed.clientHeight) < 150;
    }
    if(isBottom) loadMoreThreads();
}
window.addEventListener('scroll', checkAndLoadMore);
document.addEventListener('DOMContentLoaded', () => {
    const feed = document.getElementById('threads-feed');
    if(feed) feed.addEventListener('scroll', checkAndLoadMore);
});

function loadMoreThreads() {
    isFetchingThreads = true;

    google.script.run.withSuccessHandler(function(nextBatch) {
        if (nextBatch && nextBatch.length > 0) {
            if (nextBatch.length < 15) {
                hasMoreThreads = false;
            }
            window.cachedThreadsData = window.cachedThreadsData.concat(nextBatch);
            renderThreadsList(nextBatch, true);
            currentThreadsPage++;
        } else {
            hasMoreThreads = false;
            renderThreadsList([], true);
        }
        isFetchingThreads = false;
    }).withFailureHandler(function(e) {
        isFetchingThreads = false;
    }).getMoreThreads(currentThreadsPage);
}
function translateThread(rowIndex) {
    const textEl = document.getElementById(`thread-text-content-${rowIndex}`);
    const btnEl = document.getElementById(`thread-trans-btn-${rowIndex}`);
    if (!textEl || !btnEl) return;
    
    const originalText = textEl.innerText;
    btnEl.innerText = " ...";
    btnEl.style.pointerEvents = "none";

    google.script.run.withSuccessHandler(function(translatedText) {
        textEl.innerText = translatedText;
        btnEl.style.display = 'none'; 
    }).withFailureHandler(function(e) {
        btnEl.innerText = " Lỗi!";
        setTimeout(() => {
            btnEl.innerText = currentLang === 'en' ? ' Translation' : (currentLang === 'ja' ? ' 翻訳' : ' Dịch');
            btnEl.style.pointerEvents = "auto";
        }, 2000);
    }).translateSingleText(originalText, currentLang);
}
