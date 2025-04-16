import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router";
import { toast } from 'react-toastify';
import './LoginWebPage.css';
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons";
import { handleLoginService, checkPhonenumberEmail, createNewUser, sendForgotPassword, resetPassword } from '../../services/userService';
import Otp from "./Otp";
import { authentication } from "../../utils/firebase";
import { signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { Link } from "react-router-dom";
import Loading from '../../component/Loading';

const LoginWebPage = () => {
    const [inputValues, setInputValues] = useState({
        email: '', password: 'passwordsecrect', lastName: '', phonenumber: '', isOpen: false, dataUser: {}
    });
    const [isLogin, setIsLogin] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Nhập email, 3: Reset password
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: '',
        token: '',
        userId: ''
    });
    let history = useHistory();
    let location = useLocation();

    useEffect(() => {
        // Kiểm tra query params trong URL
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');

        if (token && userId) {
            setIsForgotPassword(true);
            setForgotPasswordStep(3);
            setForgotPasswordData({
                ...forgotPasswordData,
                token,
                userId
            });
        }
    }, [location]);

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const handleForgotPasswordChange = event => {
        const { name, value } = event.target;
        setForgotPasswordData({ ...forgotPasswordData, [name]: value });
    };

    let handleLogin = async () => {
        let res = await handleLoginService({
            email: inputValues.email,
            password: inputValues.password
        });

        if (res && res.errCode === 0) {
            localStorage.setItem("userData", JSON.stringify(res.user));
            localStorage.setItem("token", JSON.stringify(res.accessToken));
            if (res.user.roleId === "R1" || res.user.roleId === "R4") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } else {
            toast.error(res.errMessage);
        }
    };

    let handleLoginSocial = async (email) => {
        let res = await handleLoginService({
            email: email,
            password: inputValues.password
        });

        if (res && res.errCode === 0) {
            localStorage.setItem("userData", JSON.stringify(res.user));
            localStorage.setItem("token", JSON.stringify(res.accessToken));
            if (res.user.roleId === "R1" || res.user.roleId === "R4") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } else {
            toast.error(res.errMessage);
        }
    };

    let handleSaveUser = async () => {
        let res = await checkPhonenumberEmail({
            phonenumber: inputValues.phonenumber,
            email: inputValues.email
        });
        if (res.isCheck === true) {
            toast.error(res.errMessage);
        } else {
            setInputValues({
                ...inputValues, ["dataUser"]: {
                    email: inputValues.email,
                    lastName: inputValues.lastName,
                    phonenumber: inputValues.phonenumber,
                    password: inputValues.password,
                    roleId: 'R2',
                }, ["isOpen"]: true
            });
        }
    };

    const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            };
        });
    };

    let signInwithFacebook = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(authentication, provider)
            .then((re) => {
                LoginWithSocial(re);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    let LoginWithSocial = async (re) => {
        let res = await checkPhonenumberEmail({
            phonenumber: re.user.providerData[0].phoneNumber,
            email: re.user.providerData[0].email
        });

        if (res.isCheck === true) {
            setInputValues({
                ...inputValues,
                ["email"]: re.user.providerData[0].email,
            });
            handleLoginSocial(re.user.providerData[0].email);
        } else {
            getBase64FromUrl(re.user.providerData[0].photoURL).then(async (value) => {
                let res = await createNewUser({
                    email: re.user.providerData[0].email,
                    lastName: re.user.providerData[0].displayName,
                    phonenumber: re.user.providerData[0].phoneNumber,
                    avatar: value,
                    roleId: "R2",
                    password: inputValues.password
                });
                if (res && res.errCode === 0) {
                    toast.success("Tạo tài khoản thành công");
                    handleLoginSocial(re.user.providerData[0].email);
                } else {
                    toast.error(res.errMessage);
                }
            });
        }
    };

    let signInwithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(authentication, provider)
            .then(async (re) => {
                LoginWithSocial(re);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    // Forgot Password Handlers
    const handleSendCode = async () => {
        setLoading(true)
        try {
            // Placeholder: Gọi API gửi email chứa link với token và userId
            const res = await sendForgotPassword(forgotPasswordData.email);
            if (res && res.errCode === 0) {
                toast.success("Link đặt lại mật khẩu đã được gửi đến email của bạn");
                setForgotPasswordStep(1); // Giữ ở bước 1, chờ người dùng click link
            } else {
                toast.error(res.errMessage);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại");
        }
        setLoading(false)
    };

    const handleResetPassword = async () => {
        setLoading(true)
        if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }
        try {
            // Placeholder: Gọi API reset password với token và userId
            const res = await resetPassword({
                token: forgotPasswordData.token,
                id: forgotPasswordData.userId,
                password: forgotPasswordData.newPassword
            });
            if (res && res.errCode === 0) {
                toast.success("Đặt lại mật khẩu thành công");
                setIsForgotPassword(false);
                setForgotPasswordStep(1);
                setForgotPasswordData({ email: '', newPassword: '', confirmPassword: '', token: '', userId: '' });
            } else {
                toast.error(res.errMessage);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại");
        }
        setLoading(false)
    };

    return (
        <>
            {loading && <Loading />}
            {inputValues.isOpen === false && !isForgotPassword &&
                <div className="box-login" style={{ position: "relative" }}>
                    <Link to={"/"}>
                        <div style={{ position: "absolute", top: "20px", left: "20px", display: "flex", alignItems: "center", gap: "15px", color: "white", fontWeight: "bold", cursor: "pointer" }}>
                            <i className="fa-solid fa-arrow-left-long"></i> Quay về trang chủ
                        </div>
                    </Link>
                    <div className="login-container">
                        <section id="formHolder">
                            <div className="row" style={{ padding: "25px" }}>
                                <div className="" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                                    <img src="/resources/img/logo.png" width={65} height={65} style={{ objectFit: "cover", borderRadius: "5px" }} alt="" />
                                    <div className="heading">
                                        <h4>SneakerHubs</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 form">
                                    {!isLogin ?
                                        <div className="login form-peice">
                                            <div className="form-group">
                                                <label htmlFor="loginemail">Địa chỉ email</label>
                                                <input name="email" onChange={(event) => handleOnChange(event)} type="email" id="loginemail" required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="loginPassword">Mật khẩu</label>
                                                <input name="password" onChange={(event) => handleOnChange(event)} type="password" id="loginPassword" required />
                                            </div>
                                            <div className="CTA">
                                                <input onClick={() => handleLogin()} type="submit" style={{ borderRadius: "10px" }} value="Đăng nhập" />
                                                <a style={{ cursor: 'pointer' }} onClick={() => setIsLogin(true)}>Tài khoản mới</a>
                                                <a style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => setIsForgotPassword(true)}>Quên mật khẩu?</a>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                                                <FacebookLoginButton text="Đăng nhập với Facebook" iconSize="25px" style={{ width: "300px", height: "40px", fontSize: "16px" }} onClick={() => signInwithFacebook()} />
                                                <GoogleLoginButton text="Đăng nhập với Google" iconSize="25px" style={{ width: "300px", height: "40px", fontSize: "16px" }} onClick={() => signInwithGoogle()} />
                                            </div>
                                        </div>
                                        :
                                        <div className="">
                                            <div className="form-group">
                                                <label htmlFor="name">Họ và tên</label>
                                                <input type="text" name="lastName" onChange={(event) => handleOnChange(event)} scal id="name" className="name" />
                                                <span className="error" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Địa chỉ email</label>
                                                <input type="email" name="email" onChange={(event) => handleOnChange(event)} id="email" className="email" />
                                                <span className="error" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Số điện thoại</label>
                                                <input type="text" name="phonenumber" onChange={(event) => handleOnChange(event)} id="phone" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Mật khẩu</label>
                                                <input type="password" name="password" onChange={(event) => handleOnChange(event)} id="password" className="pass" />
                                                <span className="error" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="passwordCon">Xác nhận mật khẩu</label>
                                                <input type="password" name="passwordCon" id="passwordCon" className="passConfirm" />
                                                <span className="error" />
                                            </div>
                                            <div className="CTA">
                                                <input onClick={() => handleSaveUser()} style={{ borderRadius: "10px" }} type="submit" value="Lưu" id="submit" />
                                                <a style={{ cursor: 'pointer' }} onClick={() => setIsLogin(false)}>Tôi có tài khoản</a>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            }

            {inputValues.isOpen === true &&
                <Otp dataUser={inputValues.dataUser} />
            }

            {isForgotPassword &&
                <div className="box-login" style={{ position: "relative" }}>
                    <div style={{ position: "absolute", top: "20px", left: "20px", display: "flex", alignItems: "center", gap: "15px", color: "white", fontWeight: "bold", cursor: "pointer" }} onClick={() => setIsForgotPassword(false)}>
                        <i className="fa-solid fa-arrow-left-long"></i> Quay lại đăng nhập
                    </div>
                    <div className="login-container">
                        <section id="formHolder">
                            <div className="row" style={{ padding: "25px" }}>
                                <div className="" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                                    <img src="/resources/img/logo.png" width={65} height={65} style={{ objectFit: "cover", borderRadius: "5px" }} alt="" />
                                    <div className="heading">
                                        <h4>Đặt lại mật khẩu</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6 form">
                                    {forgotPasswordStep === 1 &&
                                        <div className="forgot-password form-peice">
                                            <div className="form-group">
                                                <label htmlFor="forgotEmail">Địa chỉ email</label>
                                                <input name="email" onChange={(event) => handleForgotPasswordChange(event)} type="email" id="forgotEmail" required />
                                            </div>
                                            <div className="CTA">
                                                <input onClick={() => handleSendCode()} type="submit" style={{ borderRadius: "10px" }} value="Gửi link đặt lại" />
                                            </div>
                                        </div>
                                    }
                                    {forgotPasswordStep === 3 &&
                                        <div className="forgot-password form-peice">
                                            <div className="form-group">
                                                <label htmlFor="newPassword">Mật khẩu mới</label>
                                                <input name="newPassword" onChange={(event) => handleForgotPasswordChange(event)} type="password" id="newPassword" required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                                <input name="confirmPassword" onChange={(event) => handleForgotPasswordChange(event)} type="password" id="confirmPassword" required />
                                            </div>
                                            <div className="CTA">
                                                <input onClick={() => handleResetPassword()} type="submit" style={{ borderRadius: "10px" }} value="Đặt lại mật khẩu" />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            }
        </>
    );
};

export default LoginWebPage;