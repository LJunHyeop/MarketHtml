import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // axios 인스턴스 임포트
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import './LoginPage.css'; // CSS 파일 임포트

const LoginPage = ({ onLogin }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // navigate 훅 사용

    useEffect(() => {
        setId('dkffkadl24@naver.com');
        setPassword('Test1234!@#$');
    }, []);

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        setErrorMessage('');
        if (!id || !password) {
            setErrorMessage('아이디와 비밀번호를 입력해 주세요.');
            return;
        }
        if (!isValidEmail(id)) {
            setErrorMessage('올바른 이메일 형식을 입력해 주세요.');
            return;
        }

        try {
            const response = await api.post('/api/user/sign-in', {
                userEmail: id,
                userPw: password,
            });

            // JWT 토큰을 localStorage에 저장
            localStorage.setItem('token', response.data.accessToken); // token 확인
            
            onLogin(); // 로그인 성공 시 상태 변경
            navigate('/home'); // 홈 페이지로 이동
        } catch (error) {
            console.error('로그인 실패:', error.response ? error.response.data : error.message);
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage('아이디와 비밀번호가 일치하지 않습니다.');
                } else {
                    setErrorMessage('로그인 중 오류가 발생했습니다.');
                }
            } else {
                setErrorMessage('네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
            }
        }
    };

    return (
        <div className="wrap">
            <div className="mytitle">
                <h1>로그인 페이지</h1>
                <h5>아이디, 비밀번호를 입력해 주세요</h5>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <p>
                ID: <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
            </p>
            <p>
                PW: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </p>
            <button onClick={handleLogin}>로그인하기</button>
        </div>
    );
};

export default LoginPage;
