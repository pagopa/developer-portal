'use client';
import React, { useCallback, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import NavigationArrow from '@/components/atoms/NavigationArrow/NavigationArrow';
import CtaSlide, { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { Swiper as SwiperCore } from 'swiper';

export type HeroSwiperProps = {
  cards: CtaSlideProps[];
};

const HeroSwiper = ({ cards }: HeroSwiperProps) => {
  const [swiperCore, setSwiperCore] = useState<SwiperCore>();
  const [swiperIndex, setSwiperIndex] = useState(0);

  const nextSlide = useCallback(() => {
    swiperCore?.slideTo(swiperIndex + 1);
  }, [swiperCore, swiperIndex]);

  const previusSlide = useCallback(() => {
    swiperCore?.slideTo(swiperIndex - 1);
  }, [swiperCore, swiperIndex]);

  return (
    <Swiper
      onInit={(swiper) => {
        setSwiperCore(swiper);
      }}
      initialSlide={swiperIndex}
      onActiveIndexChange={(swiperCore) => {
        setSwiperIndex(swiperCore.activeIndex);
      }}
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination]}
    >
      <div onClick={() => previusSlide()}>
        <NavigationArrow direction={'left'} hidden={swiperIndex === 0} />
      </div>
      <div onClick={() => nextSlide()}>
        <NavigationArrow
          direction={'right'}
          hidden={swiperIndex === cards.length - 1}
        />
      </div>
      {cards.map((props, index) => (
        <SwiperSlide key={index}>
          <CtaSlide {...props} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSwiper;
