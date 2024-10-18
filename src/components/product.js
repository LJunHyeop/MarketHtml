import React, { useState } from 'react';
import { uploadInstance } from '../api/axios'; // uploadInstance 임포트
import { jwtDecode } from 'jwt-decode'; // named import로 수정
import './product.css'; // 스타일 시트 임포트

const Product = ({ onComplete }) => {
    const [productName, setProductName] = useState(''); // 상품명 상태
    const [productPrice, setProductPrice] = useState(''); // 가격 상태
    const [productComment, setProductComment] = useState(''); // 본문 상태
    const [images, setImages] = useState([]); // 이미지 상태 (최대 5장)

    // 이미지 업로드 핸들러
    const handleImageChange = (event) => {
        const files = event.target.files;
        const selectedImages = Array.from(files).slice(0, 5); // 최대 5장 선택
        setImages(selectedImages); // 선택한 파일 객체를 상태로 설정
    };

    // 상품 등록 API 호출
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지

        const formData = new FormData();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = '/login'; // 로그인 페이지로 리디렉션
            return; // 이후 코드 실행 방지
        }

        const { userPk } = jwtDecode(token); // userPk 가져오기

        const productData = {
            userPk,
            productLike: 0, // 기본값 0
            productName,
            productPrice: parseFloat(productPrice),
            productComment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        formData.append('p', JSON.stringify(productData)); // 'p'라는 이름으로 객체 추가

        // 이미지가 있을 경우 추가 (최대 5장까지)
        if (images.length > 0) {
            images.forEach((file) => {
                formData.append('pics', file); // 'pics'라는 이름으로 파일 객체 추가
            });
        } else {
            formData.append('pics', null); // 이미지가 없으면 null 추가
        }

        try {
            const response = await uploadInstance.post('/api/product/registration', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log('상품 등록 성공:', response.data);
                window.location.href = `/product/${response.data.productId}`; // 상품 ID에 따라 페이지 이동
                onComplete(); // 상품 등록 완료 시 호출
            }
        } catch (error) {
            console.error('상품 등록 에러:', error);
            if (error.response) {
                alert('상품 등록에 실패했습니다: ' + (error.response.data.message || error.message)); // 서버에서 보낸 오류 메시지 표시
            } else {
                alert('서버와 연결할 수 없습니다. 나중에 다시 시도해 주세요.');
            }
        }
    };

    return (
        <div className="container">
            <h3>상품 등록</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="productName">상품명:</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="상품명을 입력하세요"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="productPrice">가격:</label>
                    <input
                        type="number"
                        id="productPrice"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="가격을 입력하세요"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="productComment">본문:</label>
                    <textarea
                        id="productComment"
                        value={productComment}
                        onChange={(e) => setProductComment(e.target.value)}
                        placeholder="본문을 입력하세요"
                        required
                    />
                </div>

                <div>
                    <label>사진 업로드:</label>
                    <div className="image-upload">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                            style={{ display: 'none' }}
                            id="fileInput"
                        />
                        <label htmlFor="fileInput" className="image-upload-box">
                            {images.length > 0 ? (
                                images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className="preview-image"
                                    />
                                ))
                            ) : (
                                '여기에 이미지를 클릭하여 업로드하세요'
                            )}
                        </label>
                    </div>
                </div>

                <button type="submit">등록하기</button>
            </form>
        </div>
    );
};

export default Product;
