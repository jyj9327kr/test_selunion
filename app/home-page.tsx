/* oxlint-disable nextjs/no-img-element -- Preserve local reference images without an image proxy. */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import boards from './boards.json';
const slides = [
  { id: 32, label: 'SELU 9월 퀴즈 이벤트' },
  { id: 24, label: 'SELU 조합소식' },
  { id: 30, label: 'SELU 조합원 안내' },
  { id: 27, label: '휴양소 방문후기' },
  { id: 25, label: '조합원 휴양소' },
];
const menus = ['조합소개', '알림마당', '자료실', '소통 및 문의', '지원&혜택'];
export default function HomePage({ eventUrl }: { eventUrl: string }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (
      !playing ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = window.setInterval(
      () => setActive((slide) => (slide + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  return (
    <>
      <a className="skip-link" href="#container">
        본문 바로가기
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="logo" href="/" aria-label="SELU 홈">
            <img
              src="/assets/logo.png"
              alt="삼성그룹 초기업 노동조합 삼성전자 지부"
            />
          </Link>
          <nav className="main-nav" aria-label="주 메뉴">
            {menus.map((menu) => (
              <span key={menu}>{menu}</span>
            ))}
          </nav>
          <div className="header-actions">
            <span className="join-label">회원가입</span>
            <span>
              <img src="/assets/login.png" alt="로그인" />
            </span>
            <span>
              <img src="/assets/search.png" alt="검색" />
            </span>
            <span>
              <img src="/assets/menu.png" alt="메뉴" />
            </span>
          </div>
        </div>
      </header>
      <main id="container" className="main-wrap">
        <h1 className="sr-only">삼성그룹 초기업 노동조합 삼성전자 지부</h1>
        <div className="member-count">
          <p>
            조합원 <strong>53,270</strong>명
          </p>
          <p className="count-date">- 2026년 9월 9일 11시</p>
        </div>
        <section className="banner" aria-label="주요 소식 및 이벤트">
          {slides.map((slide, index) => (
            <a
              key={slide.id}
              href={eventUrl}
              className="banner-slide"
              hidden={active !== index}
              aria-label={`${slide.label} 바로가기`}
              data-testid={`banner-${index}`}
            >
              <picture>
                <source
                  media="(max-width: 1280px)"
                  srcSet={`/assets/banner-${slide.id}-mobile.jpg`}
                />
                <img
                  src={`/assets/banner-${slide.id}.jpg`}
                  alt={slide.label}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                />
              </picture>
            </a>
          ))}
          <a className="event-button" href={eventUrl} data-testid="event-link">
            이벤트 바로가기 <span aria-hidden="true">↗</span>
          </a>
          <div className="banner-controls">
            <button
              type="button"
              onClick={() =>
                setActive((active + slides.length - 1) % slides.length)
              }
              aria-label="이전 배너"
            >
              <img src="/assets/prev_icon.svg" alt="" />
            </button>
            <div className="paging">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`${index + 1}번 배너`}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                >
                  <span className={active === index ? 'active' : ''} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPlaying(!playing)}
              aria-label={playing ? '배너 자동재생 정지' : '배너 자동재생 시작'}
            >
              <img
                className="play-icon"
                src={`/assets/${playing ? 'pause' : 'play'}.svg`}
                alt=""
              />
            </button>
            <button
              type="button"
              onClick={() => setActive((active + 1) % slides.length)}
              aria-label="다음 배너"
            >
              <img className="next-icon" src="/assets/prev_icon.svg" alt="" />
            </button>
          </div>
        </section>
        <div className="boards">
          {boards.map((board, index) => (
            <section
              className="board"
              key={board.title}
              aria-labelledby={`board-${index}`}
            >
              <div className="board-heading">
                <h2 id={`board-${index}`}>{board.title}</h2>
                <span className="more">
                  자세히보기
                  <img src="/assets/more-icon.svg" alt="" />
                </span>
              </div>
              <ul className="board-list">
                {board.items.map((item) => (
                  <li key={item.title}>
                    {item.title.includes('이벤트') ? (
                      <a href={eventUrl}>
                        <p className="post-title">{item.title}</p>
                        <time>{item.date}</time>
                      </a>
                    ) : (
                      <>
                        <p className="post-title">{item.title}</p>
                        <time>{item.date}</time>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-links">
              <span>이용약관</span>
              <span>개인정보처리방침</span>
            </div>
            <span className="family-site">
              패밀리사이트 <span aria-hidden="true">⌄</span>
            </span>
          </div>
          <div className="footer-info">
            <p>
              <span>주소 : 경기도 평택시 고덕국제2로 45 248호</span>
              <span>고유번호 : 316-82-74586</span>
            </p>
            <p>
              <span>대표자 : 최승호</span>
              <span>연락처 : 010-3134-7984</span>
              <span>이메일 : selu@selunion.co.kr</span>
              <span>문의 : help@selunion.co.kr</span>
            </p>
          </div>
          <div className="footer-bottom">
            <p>
              @Copyright 2024. 삼성그룹 초기업 노동조합 삼성전자 지부 All Rights
              Reserved.
            </p>
            <img src="/assets/ft_logo.png" alt="하단 SELU 로고" />
          </div>
          <p className="test-note">로컬 보안 테스트용 재현 페이지</p>
        </div>
      </footer>
    </>
  );
}
