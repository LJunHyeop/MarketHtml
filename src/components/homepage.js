import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from './Map'; // Map 컴포넌트 import 수정
import './homepage.css';

const HomePage = ({ onLogout }) => {
    const [products, setProducts] = useState([]);
    const [mannerTemperature, setMannerTemperature] = useState(null);
    const [marker, setMarker] = useState(null);
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
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
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [navigate]);

    const handleStartAssessment = () => {
        navigate('/assessment');
    };

    const handleAddTransaction = () => {
        navigate('/product');
    };

    return (
        <div className="container">
            <header>
                <div className="picture"></div>
                <h1>당근마켓</h1>
                <button className="UsedTrade" onClick={fetchProducts}>중고거래</button>
            </header>
            <main>
                <h2>환영합니다!</h2>
                <p>당신의 최근 거래 내역:</p>
                <div id="recent-transactions">
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
                <h3>상대 매너온도: {mannerTemperature ? `${mannerTemperature}°C` : '정보 없음'}</h3>
                <button onClick={handleStartAssessment}>매너 평가하기</button>
                <button onClick={handleAddTransaction}>거래 추가하기</button>
                <button onClick={handleLogout}>로그아웃</button>

                {/* Map 컴포넌트 추가 */}
                <Map center={{ lat: 37.566826, lng: 126.9786567 }} /> {/* 서울시청의 위도와 경도 */}
                <p>클릭한 위치의 주소: {address}</p>
            </main>
        </div>
    );
};

export default HomePage;
