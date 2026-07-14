import Link from 'next/link';

export default function BlogGrid({ posts }: { posts: any[] }) {
  return (
    <div className="bg-[#fdfbf7] py-16 w-full">
      <div className="max-w-[1224px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link key={post.id} href={`/blog-list/${post.slug}`} className="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white transform hover:-translate-y-1 duration-300">
            <div className="relative h-64 overflow-hidden">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-4 right-4 bg-white/90 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4 font-oswald tracking-tight">{post.title}</h3>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-semibold text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')} • {post.readTime} min de leitura
                </span>
                <span className="text-orange-500 font-bold hover:text-orange-600 transition-colors uppercase text-sm tracking-widest">
                  Leia mais
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
