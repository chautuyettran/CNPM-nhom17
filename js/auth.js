function hienThiLoi(message) {
    const box = document.getElementById("thongBao");
    if (box) {
        box.innerText = message;
        box.className = "alert-box alert-error";
        box.style.display = "block";
    } else {
        alert("Lỗi: " + message);
    }
}

function hienThiThanhCong(message) {
    const box = document.getElementById("thongBao");
    if (box) {
        box.innerText = message;
        box.className = "alert-box alert-success";
        box.style.display = "block";
    } else {
        alert("Thành công: " + message);
    }
}

async function dangKy() {
    const hoten = document.getElementById("hoten").value.trim();
    const email = document.getElementById("email").value.trim();
    const matkhau = document.getElementById("matkhau").value.trim();
    const nhaplaimatkhau = document.getElementById("nhaplaimatkhau").value.trim();

    if (!hoten || !email || !matkhau || !nhaplaimatkhau) {
        hienThiLoi("Vui lòng nhập đầy đủ thông tin đăng ký!");
        return;
    }

    if (!email.includes("@")) {
        hienThiLoi("Địa chỉ Email nhập vào không hợp lệ!");
        return;
    }

    if (matkhau !== nhaplaimatkhau) {
        hienThiLoi("Mật khẩu nhập lại không trùng khớp!");
        return;
    }

    if (matkhau.length < 6) {
        hienThiLoi("Mật khẩu phải có độ dài từ 6 ký tự trở lên!");
        return;
    }

    try {
        await request("/auth/register", "POST", {
            name: hoten,
            email: email,
            password: matkhau
        });

        hienThiThanhCong("Đăng ký tài khoản thành công! Đang chuyển hướng...");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (err) {
        hienThiLoi(err.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
    }
}

async function dangNhap() {
    const email = document.getElementById("email").value.trim();
    const matkhau = document.getElementById("matkhau").value.trim();

    if (!email || !matkhau) {
        hienThiLoi("Vui lòng nhập đầy đủ Email và Mật khẩu!");
        return;
    }

    try {
        const res = await request("/auth/login", "POST", {
            email: email,
            password: matkhau
        });

        localStorage.setItem("token", res.token);

        hienThiThanhCong("Đăng nhập thành công! Đang vào hệ thống...");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (err) {
        hienThiLoi(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.");
    }
}


window.onload = function () {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", 
            callback: handleCredentialResponse 
        });
        
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large", width: "100%" } 
        );
        
        google.accounts.id.prompt(); 
    }
};

async function handleCredentialResponse(response) {
    try {
        hienThiThanhCong("Đang xác thực tài khoản Google...");
        
        const res = await request("/auth/google", "POST", {
            idToken: response.credential
        });

        localStorage.setItem("token", res.token);

        hienThiThanhCong("Đăng nhập Google thành công! Đang vào hệ thống...");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (err) {
        hienThiLoi(err.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
}