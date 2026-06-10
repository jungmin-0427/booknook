import type { Book, Leaf, Objet } from '../types/book'

export const mockBooks: Book[] = [
  {
    id: 'b1', title: '작별하지 않는다', author: '한강', publisher: '문학동네',
    coverColor: ['#4A7BA7', '#8BB4D1', '#C8DDE9'],
    totalPages: 320, status: 'reading', currentPage: 144, progressPercent: 45,
    rating: null, memo: '', addedAt: '2024-11-10',
    lastReadAt: '2024-11-25', finishedAt: null,
  },
  {
    id: 'b2', title: '채식주의자', author: '한강', publisher: '창비',
    coverColor: ['#2D5016', '#5A7A2E', '#8FA85C'],
    totalPages: 247, status: 'reading', currentPage: 178, progressPercent: 72,
    rating: null, memo: '섬뜩하지만 눈을 뗄 수 없어', addedAt: '2024-11-05',
    lastReadAt: '2024-11-24', finishedAt: null,
  },
  {
    id: 'b3', title: '파친코', author: '이민진', publisher: '인플루엔셜',
    coverColor: ['#8B4513', '#C07040', '#E0A070'],
    totalPages: 840, status: 'reading', currentPage: 168, progressPercent: 20,
    rating: null, memo: '', addedAt: '2024-11-15',
    lastReadAt: '2024-11-20', finishedAt: null,
  },
  {
    id: 'f1', title: '소년이 온다', author: '한강', publisher: '창비',
    coverColor: ['#1A1A2E', '#16213E', '#0F3460'],
    totalPages: 216, status: 'done', currentPage: 216, progressPercent: 100,
    rating: 5, memo: '읽는 내내 울었다', addedAt: '2024-09-01',
    lastReadAt: '2024-09-20', finishedAt: '2024-09-20',
  },
  {
    id: 'f2', title: '아몬드', author: '손원평', publisher: '창비',
    coverColor: ['#D4A853', '#E8C170', '#F5DFA0'],
    totalPages: 264, status: 'done', currentPage: 264, progressPercent: 100,
    rating: 4, memo: '감정이 없다는 것이 오히려 감동적', addedAt: '2024-08-05',
    lastReadAt: '2024-08-22', finishedAt: '2024-08-22',
  },
  {
    id: 'f3', title: '달러구트 꿈 백화점', author: '이미예', publisher: '팩토리나인',
    coverColor: ['#6B4E9B', '#9370CC', '#C4A0E8'],
    totalPages: 320, status: 'done', currentPage: 320, progressPercent: 100,
    rating: 4, memo: '잠들기 전 읽기 딱 좋은 책', addedAt: '2024-07-10',
    lastReadAt: '2024-07-28', finishedAt: '2024-07-28',
  },
  {
    id: 'f4', title: '불편한 편의점', author: '김호연', publisher: '나무옆의자',
    coverColor: ['#2E8B57', '#52B27E', '#80CFA0'],
    totalPages: 284, status: 'done', currentPage: 284, progressPercent: 100,
    rating: 3, memo: '', addedAt: '2024-06-15',
    lastReadAt: '2024-07-02', finishedAt: '2024-07-02',
  },
  {
    id: 'w1', title: '흰', author: '한강', publisher: '문학동네',
    coverColor: ['#E8E0D0', '#F0EAE0', '#F8F4F0'],
    totalPages: 136, status: 'wishlist', currentPage: 0, progressPercent: 0,
    rating: null, memo: '', addedAt: '2024-11-20',
    lastReadAt: null, finishedAt: null,
  },
  {
    id: 'w2', title: '연을 쫓는 아이', author: '할레드 호세이니', publisher: '현대문학',
    coverColor: ['#C17F24', '#D4982A', '#E8B845'],
    totalPages: 432, status: 'wishlist', currentPage: 0, progressPercent: 0,
    rating: null, memo: '', addedAt: '2024-11-18',
    lastReadAt: null, finishedAt: null,
  },
  {
    id: 'w3', title: '어린왕자', author: '앙투안 드 생텍쥐페리', publisher: '열린책들',
    coverColor: ['#1565C0', '#1976D2', '#64B5F6'],
    totalPages: 120, status: 'wishlist', currentPage: 0, progressPercent: 0,
    rating: null, memo: '', addedAt: '2024-11-08',
    lastReadAt: null, finishedAt: null,
  },
]

export const mockLeaves: Leaf[] = [
  {
    id: 'l1', bookId: 'b1',
    sentence: '이것이 지극한 사랑에 이르는 길이라고 내가 믿었던 것들은 모두 지금 바다 속에 있다.',
    createdAt: '2024-11-25',
  },
  {
    id: 'l2', bookId: 'b2',
    sentence: '나는 꿈을 꾸지 않는 사람이 되고 싶었다.',
    createdAt: '2024-11-24',
  },
  {
    id: 'l3', bookId: 'f1',
    sentence: '우리가 패배하더라도 우리가 옳았다는 것을, 우리가 인간이었다는 것을 기억해달라.',
    createdAt: '2024-09-18',
  },
  {
    id: 'l4', bookId: 'f2',
    sentence: '감정이 없다는 것, 그게 때로는 가장 깊은 공감일 수 있다.',
    createdAt: '2024-08-20',
  },
]

export const mockObjets: Objet[] = [
  { id: 'o1', name: '빈티지 카메라', emoji: '📷', unlockCondition: 3, unlockedAt: '2024-09-20' },
  { id: 'o2', name: '도자기 머그컵', emoji: '☕', unlockCondition: 7, unlockedAt: null },
  { id: 'o3', name: '레트로 스탠드 조명', emoji: '💡', unlockCondition: 15, unlockedAt: null },
]

export const mockSearchPool = [
  { id: 's1', title: '흰', author: '한강', publisher: '문학동네', coverColor: ['#E8E0D0', '#F0EAE0'], totalPages: 136 },
  { id: 's2', title: '채식주의자', author: '한강', publisher: '창비', coverColor: ['#2D5016', '#5A7A2E'], totalPages: 247 },
  { id: 's3', title: '소년이 온다', author: '한강', publisher: '창비', coverColor: ['#1A1A2E', '#16213E'], totalPages: 216 },
  { id: 's4', title: '연을 쫓는 아이', author: '할레드 호세이니', publisher: '현대문학', coverColor: ['#C17F24', '#D4982A'], totalPages: 432 },
  { id: 's5', title: '1984', author: '조지 오웰', publisher: '민음사', coverColor: ['#2C3E50', '#4A6D8C'], totalPages: 368 },
  { id: 's6', title: '데미안', author: '헤르만 헤세', publisher: '민음사', coverColor: ['#5D4037', '#795548'], totalPages: 248 },
  { id: 's7', title: '어린왕자', author: '생텍쥐페리', publisher: '열린책들', coverColor: ['#1565C0', '#1976D2'], totalPages: 120 },
  { id: 's8', title: '노인과 바다', author: '어니스트 헤밍웨이', publisher: '민음사', coverColor: ['#00695C', '#00897B'], totalPages: 127 },
  { id: 's9', title: '82년생 김지영', author: '조남주', publisher: '민음사', coverColor: ['#8B2635', '#C04A5A'], totalPages: 190 },
  { id: 's10', title: '파친코', author: '이민진', publisher: '인플루엔셜', coverColor: ['#8B4513', '#C07040'], totalPages: 840 },
]
