export type BookStatus = 'reading' | 'done' | 'wishlist'

export interface Book {
  id: string
  isbn?: string
  title: string
  author: string
  publisher?: string
  coverImageUrl?: string
  coverColor: string[]        // fallback gradient
  totalPages: number | null
  status: BookStatus
  currentPage: number
  progressPercent: number     // auto: currentPage / totalPages * 100
  rating: number | null       // 1~5 단풍잎, done 상태에서만 유효
  memo: string
  addedAt: string
  lastReadAt: string | null
  finishedAt: string | null
}

export interface Leaf {
  id: string
  bookId: string
  sentence: string
  createdAt: string
}

export interface Objet {
  id: string
  name: string
  emoji: string
  unlockCondition: number     // 필요 완독 수
  unlockedAt: string | null   // null = 미획득
}
