import Head from 'next/head'
import { GetStaticProps } from 'next/types'
import { createClient } from '../../../prismicio'
import styles from './styles.module.scss'
import { RichText } from 'prismic-dom'
import Link from 'next/link'

interface Post{
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string
}

interface PostsProps{    
    posts: Post[]
}

export default function Posts({posts}: PostsProps){
    //console.log(posts)
    return(
        <>
            <Head>
                <title>Posts - IgNews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link key={post.slug} href={`/posts/${post.slug}`}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = createClient()

    const response = await prismic.getAllByType('ig-news-post',
        {fetch: ['Post.Title', 'Post.Content'],
        pageSize: 100,}
    )
    
    //console.log(JSON.stringify(response, null, 2))

    const posts = response.map(
        post => {
            return {
                slug: post.uid,
                title: RichText.asText(post.data.Title),
                excerpt: post.data.Content.find(content => content.type === 'paragraph')?.text ?? "",
                updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-br', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        }
    )

    return {
        props: { posts }
    }
} 