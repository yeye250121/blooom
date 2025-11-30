import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminAuth } from '@/lib/admin/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const { data: categories, error } = await supabase
      .from('guide_categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Failed to fetch categories:', error)
      return NextResponse.json({ error: '카테고리 조회 실패' }, { status: 500 })
    }

    // 각 카테고리별 가이드 수 조회
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from('guides')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)

        return {
          ...category,
          guideCount: count || 0,
        }
      })
    )

    return NextResponse.json({ categories: categoriesWithCount })
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// POST: 새 카테고리 생성
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name?.trim()) {
      return NextResponse.json({ error: '카테고리명을 입력해주세요' }, { status: 400 })
    }

    // slug 생성
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // 중복 확인
    const { data: existing } = await supabase
      .from('guide_categories')
      .select('id')
      .or(`name.eq.${name},slug.eq.${slug}`)
      .single()

    if (existing) {
      return NextResponse.json({ error: '이미 존재하는 카테고리입니다' }, { status: 400 })
    }

    // 마지막 display_order 조회
    const { data: lastCategory } = await supabase
      .from('guide_categories')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single()

    const displayOrder = (lastCategory?.display_order ?? -1) + 1

    // 카테고리 생성
    const { data: category, error } = await supabase
      .from('guide_categories')
      .insert({
        name: name.trim(),
        slug,
        display_order: displayOrder,
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to create category:', error)
      return NextResponse.json({ error: '카테고리 생성 실패' }, { status: 500 })
    }

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('Categories POST error:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
