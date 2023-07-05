import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import NavigationArrow from '@/components/atoms/NavigationArrow/NavigationArrow';
import CtaSlide, { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';

export type HeroSwiperProps = {
  cards: CtaSlideProps[];
};

const HeroSwiper = ({ cards }: HeroSwiperProps) => {
  const [swiperIndex, setSwiperIndex] = useState(0);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  return (
    <Swiper
      initialSlide={swiperIndex}
      navigation={{
        prevEl: navigationPrevRef.current,
        nextEl: navigationNextRef.current,
      }}
      onActiveIndexChange={(swiperCore) => {
        setSwiperIndex(swiperCore.activeIndex);
      }}
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination]}
    >
      <div ref={navigationPrevRef}>
        <NavigationArrow direction={'left'} hidden={swiperIndex === 0} />
      </div>
      <div ref={navigationNextRef}>
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
