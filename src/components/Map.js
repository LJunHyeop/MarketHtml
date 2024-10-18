// src/components/Map.js
import React, { useEffect } from 'react';

const Map = ({ center }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=197b54c4c308ae881d147610bde2b5be&libraries=services`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            // 카카오 맵 API가 로드된 후 실행
            const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
            const options = {
                center: new window.kakao.maps.LatLng(center.lat, center.lng), // 중심 좌표
                level: 3, // 지도 레벨
            };

            // 카카오 맵 생성
            const map = new window.kakao.maps.Map(container, options);

            // 지도 클릭 이벤트 처리
            window.kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
                const latlng = mouseEvent.latLng;
                console.log('클릭한 위치:', latlng.getLat(), latlng.getLng());
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [center]);

    return (
        <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
    );
};

export default Map;
