import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버의 포트에 맞게 수정
    timeout: 5000, // 요청 제한 시간 설정 (선택 사항)
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터 추가
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // 헤더에 토큰 추가
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 파일 업로드 인스턴스
const uploadInstance = axios.create({
    baseURL: 'http://localhost:8080', // 백엔드 서버의 포트에 맞게 수정
    timeout: 5000, // 요청 제한 시간 설정 (선택 사항)
    headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드에 적합한 Content-Type
    }
});

// 요청 인터셉터 추가 (업로드 인스턴스)
uploadInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // 헤더에 토큰 추가
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// instance를 기본 내보내기로, uploadInstance를 이름으로 내보냅니다.
export default instance;
export { uploadInstance }; // 이름 내보내기
