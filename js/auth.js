// --- CÁC HÀM TRỢ GIÚP HIỂN THỊ THÔNG BÁO LÊN MÀN HÌNH ---
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

// --- LUỒNG XỬ LÝ ĐĂNG KÝ ---
async function dangKy() {
    // Đã sửa thành "hoten" cho khớp 100% với id trong file HTML
    const hoten = document.getElementById("hoten").value.trim();
    const email = document.getElementById("email").value.trim();
    const matkhau = document.getElementById("matkhau").value.trim();
    const nhaplaimatkhau = document.getElementById("nhaplaimatkhau").value.trim();

    // 1. Kiểm tra các trường dữ liệu trống
    if (!hoten || !email || !matkhau || !nhaplaimatkhau) {
        hienThiLoi("Vui lòng nhập đầy đủ thông tin đăng ký!");
        return;
    }

    // 2. Kiểm tra định dạng Email
    if (!email.includes("@")) {
        hienThiLoi("Địa chỉ Email nhập vào không hợp lệ!");
        return;
    }

    // 3. Kiểm tra mật khẩu nhập lại
    if (matkhau !== nhaplaimatkhau) {
        hienThiLoi("Mật khẩu nhập lại không trùng khớp!");
        return;
    }

    // 4. Kiểm tra độ dài mật khẩu (Ví dụ tối thiểu 6 ký tự)
    if (matkhau.length < 6) {
        hienThiLoi("Mật khẩu phải có độ dài từ 6 ký tự trở lên!");
        return;
    }

    try {
        // Gửi thông tin lên endpoint đăng ký của Backend NodeJS thông qua hàm request() trong api.js
        await request("/auth/register", "POST", {
            name: hoten,
            email: email,
            password: matkhau
        });

        hienThiThanhCong("Đăng ký tài khoản thành công! Đang chuyển hướng...");

        // Đợi 1.5 giây để người dùng nhìn thấy thông báo thành công rồi mới chuyển trang
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (err) {
        // Lỗi từ Server hoặc kết nối sẽ được hiển thị thông qua khối catch này
        hienThiLoi(err.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
    }
}

// --- LUỒNG XỬ LÝ ĐĂNG NHẬP ---
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

        // Lưu Token mã hóa vào bộ nhớ trình duyệt
        localStorage.setItem("token", res.token);

        hienThiThanhCong("Đăng nhập thành công! Đang vào hệ thống...");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (err) {
        hienThiLoi(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.");
    }
}

// --- XỬ LÝ ĐĂNG NHẬP BẰNG GOOGLE ---

// 1. Khởi tạo cấu hình Google khi trang web tải xong
window.onload = function () {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            // Thay bằng Client ID thật của bạn từ Google Cloud Console
            client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", 
            callback: handleCredentialResponse // Hàm sẽ chạy sau khi đăng nhập Google thành công
        });
        
        // Hiển thị nút Đăng nhập Google chuẩn vào thẻ div#buttonDiv
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: "outline", size: "large", width: "100%" } 
        );
        
        // (Tùy chọn) Hiển thị hộp thoại One Tap gọi ý đăng nhập nhanh góc màn hình
        google.accounts.id.prompt(); 
    }
};

// 2. Hàm xử lý phản hồi Token nhận được từ Google
async function handleCredentialResponse(response) {
    try {
        hienThiThanhCong("Đang xác thực tài khoản Google...");
        
        // Gửi ID Token nhận từ Google lên endpoint backend của bạn
        const res = await request("/auth/google", "POST", {
            idToken: response.credential
        });

        // Lưu JWT Token mà Backend của bạn tạo ra vào localStorage
        localStorage.setItem("token", res.token);

        hienThiThanhCong("Đăng nhập Google thành công! Đang vào hệ thống...");

        // Chuyển hướng người dùng vào trang quản lý công việc chính
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);

    } catch (err) {
        hienThiLoi(err.message || "Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
}