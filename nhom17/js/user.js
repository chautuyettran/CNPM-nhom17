/* Save Profile */

function saveProfile() {

    const profile = {

        username:
            document.getElementById("username").value,

        email:
            document.getElementById("email").value,

        role:
            document.getElementById("role").value
    };

    localStorage.setItem(
        "userProfile",
        JSON.stringify(profile)
    );

    alert("Đã lưu thông tin");

    window.location.href = "index.html";
}

/* Load Profile */

function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem("userProfile")
        );

    if (profile) {

        document.getElementById("username")
            .value = profile.username;

        document.getElementById("email")
            .value = profile.email;

        document.getElementById("role")
            .value = profile.role;
    }

    /* Load Avatar */

    const avatar =
        localStorage.getItem("userAvatar");

    if (avatar) {

        document.getElementById(
            "avatarPreview"
        ).src = avatar;
    }
}

/* Back */

function goBack() {

    window.location.href = "index.html";
}

/* Change Avatar */

function changeAvatar(event) {

    const file = event.target.files[0];

    if (!file) {

        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const image = e.target.result;

        /* Hiện ảnh ngay lập tức */

        document.getElementById(
            "avatarPreview"
        ).src = image;

        /* Lưu localStorage */

        localStorage.setItem(
            "userAvatar",
            image
        );
    };

    reader.readAsDataURL(file);
}

/* Remove Avatar */

function removeAvatar() {

    const defaultAvatar =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    /* Đổi ảnh về mặc định */

    document.getElementById("avatarPreview")
        .src = defaultAvatar;

    /* Xóa localStorage */

    localStorage.removeItem("userAvatar");

    alert("Đã xoá ảnh đại diện");
}

/* Run */

loadProfile();