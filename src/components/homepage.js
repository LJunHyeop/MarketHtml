import React, { useEffect, useState } from 'react';
import './homepage.css'; // 스타일 시트 임포트

const HomePage = () => {
    const [products, setProducts] = useState([]); // 상품 목록을 저장할 상태
    const handleLogout = () => {
        localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
        window.location.reload(); // 페이지 새로고침
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/product/get', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data); // 응답 데이터를 상태에 저장
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleUsedTradeClick = () => {
        fetchProducts(); // API 호출
    };

    useEffect(() => {
        // 페이지가 로드될 때 토큰이 없으면 로그인 페이지로 리디렉션
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login'; // 로그인 페이지 URL로 변경
        }
    }, []);

    return (
        <div className="container">
            <header>
                <div className="picture"></div> {/* 이미지 표시를 위한 div 추가 */}
                <h1>당근마켓</h1>
                <button class ="UsedTrade" onClick={handleUsedTradeClick}>중고거래</button> {/* 버튼 클릭 시 API 호출 */}
            </header>
            <main>
                <h2>환영합니다!</h2>
                <p>당신의 최근 거래 내역:</p>
                <div id="recent-transactions">
                    {/* 거래 내역은 여기에 동적으로 추가됩니다. */}
                    {products.length > 0 ? (
                        <ul>
                            {products.map(product => (
                                <li key={product.id}>{product.name} - {product.price}원</li>
                            ))}
                        </ul>
                    ) : (
                        <p>상품이 없습니다.</p>
                    )}
                </div>
                <button id="addTransactionButton">거래 추가하기</button>
            </main>
            <button id="logoutButton" onClick={handleLogout}>로그아웃</button>
        </div>
    );
};

export default HomePage;
