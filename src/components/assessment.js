import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // named import로 수정
import './assessment.css'; // 스타일 시트 임포트

const Assessment = ({ onComplete }) => {
    const [mannerItems, setMannerItems] = useState([]);
    const [selectedPositive, setSelectedPositive] = useState([]);
    const [selectedNegative, setSelectedNegative] = useState([]);

    useEffect(() => {
        const fetchMannerItems = async () => {
            try {
                const response = await fetch('/api/manner/assessment');
                if (!response.ok) throw new Error('Failed to fetch manner items');
                const data = await response.json();
                setMannerItems(data);
            } catch (error) {
                console.error('Error fetching manner items:', error);
            }
        };
        fetchMannerItems();
    }, []);

    const handleCheckboxChange = (mannerId, type) => {
        if (type === 'positive') {
            setSelectedPositive(prev => {
                if (prev.includes(mannerId)) {
                    return prev.filter(id => id !== mannerId);
                } else if (prev.length < 5) {
                    return [...prev, mannerId];
                }
                return prev;
            });
        } else if (type === 'negative') {
            setSelectedNegative(prev => {
                if (prev.includes(mannerId)) {
                    return prev.filter(id => id !== mannerId);
                } else if (prev.length < 5) {
                    return [...prev, mannerId];
                }
                return prev;
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedMannerIds = [...selectedPositive, ...selectedNegative];
        
        if (selectedMannerIds.length > 0) {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userPk = decodedToken.userPk; // userPk 가져오기

            console.log('User PK:', userPk); // 디버깅 로그
            console.log('Selected Manner IDs:', selectedMannerIds); // 디버깅 로그
            
            try {
                const response = await fetch('/api/assessment/deal', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userPk, mannerIds: selectedMannerIds }), // userPk 추가
                });

                if (!response.ok) throw new Error('Failed to submit manner evaluation');

                // 성공적으로 제출된 후 처리
                onComplete(); 
            } catch (error) {
                console.error('Error submitting manner evaluation:', error);
            }
        } else {
            alert('매너를 선택해 주세요!');
        }
    };

    return (
        <div className="assessment">
            <h1>매너 평가</h1>
            <form onSubmit={handleSubmit}>
                <h2>긍정적인 평가 (최대 5개, {selectedPositive.length}/5 선택됨)</h2>
                {mannerItems.filter(item => item.type === 1).map((item) => (
                    <div className="checkbox-group" key={item.mannerId}>
                        <label>
                            {item.sentence}
                            <input
                                type="checkbox"
                                checked={selectedPositive.includes(item.mannerId)}
                                onChange={() => handleCheckboxChange(item.mannerId, 'positive')}
                                disabled={selectedPositive.length >= 5 && !selectedPositive.includes(item.mannerId)}
                            />
                        </label>
                    </div>
                ))}

                <h2>부정적인 평가 (최대 5개, {selectedNegative.length}/5 선택됨)</h2>
                {mannerItems.filter(item => item.type === 2).map((item) => (
                    <div className="checkbox-group" key={item.mannerId}>
                        <label>
                            {item.sentence}
                            <input
                                type="checkbox"
                                checked={selectedNegative.includes(item.mannerId)}
                                onChange={() => handleCheckboxChange(item.mannerId, 'negative')}
                                disabled={selectedNegative.length >= 5 && !selectedNegative.includes(item.mannerId)}
                            />
                        </label>
                    </div>
                ))}

                <button type="submit">제출하기</button>
            </form>
        </div>
    );
};

export default Assessment;
