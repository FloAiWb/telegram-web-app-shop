// src/components/HeroSlider.tsx

import React from "react";
import { useGetSliders } from "@framework/api/slider/get";
import { Carousel } from "antd";
import t from "@/i18n/ru";

const HeroSlider: React.FC = () => {
  const { data } = useGetSliders();

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Carousel rootClassName="rounded-lg overflow-hidden" autoplay>
      {data.map((item, idx) => (
        <div key={idx} className="h-[160px] w-full">
          <a href={item.url}>
            <img
              src={`${import.meta.env.VITE_API_URL}/${item.photo_Path}`}
              alt={t.sliderImageAlt}
              className="w-full h-full object-cover"
            />
          </a>
        </div>
      ))}
    </Carousel>
  );
};

export default HeroSlider;
