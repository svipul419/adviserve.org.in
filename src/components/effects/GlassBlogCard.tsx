/**
 * GlassBlogCard — glassmorphic editorial card. Adapted from 21st.dev.
 * Inlined shadcn Card/Badge/Avatar to avoid the dependency.
 */
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GlassBlogCardProps {
  title?: string;
  excerpt?: string;
  image?: string;
  author?: { name: string; avatar: string };
  date?: string;
  readTime?: string;
  tags?: string[];
  href?: string;
  className?: string;
}

const defaultPost = {
  title: 'The Future of UI Design',
  excerpt: 'Exploring the latest trends in glassmorphism, 3D elements, and micro-interactions.',
  image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  author: { name: 'Moumen Soliman', avatar: 'https://github.com/shadcn.png' },
  date: 'Dec 2, 2025',
  readTime: '5 min read',
  tags: ['Design', 'UI/UX'],
};

export function GlassBlogCard({
  title = defaultPost.title,
  excerpt = defaultPost.excerpt,
  image = defaultPost.image,
  author = defaultPost.author,
  date = defaultPost.date,
  readTime = defaultPost.readTime,
  tags = defaultPost.tags,
  href,
  className,
}: GlassBlogCardProps) {
  const initial = author?.name?.[0] ?? '?';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('w-full max-w-[400px]', className)}
    >
      <a
        href={href ?? '#'}
        className={cn(
          'group relative block h-full overflow-hidden rounded-2xl border bg-card/30 backdrop-blur-md transition-all duration-300',
          'border-[var(--border)] hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[color:var(--primary)]/10',
        )}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm transition-colors"
                style={{
                  color: '#0B1426',
                  background: 'rgba(251,253,255,0.92)',
                  border: '1px solid rgba(30,157,241,0.55)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/20 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--primary-foreground)] shadow-lg shadow-[color:var(--primary)]/25"
            >
              <BookOpen className="h-4 w-4" />
              Read Article
            </motion.span>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="space-y-2">
            <h3 className="font-display text-xl leading-tight tracking-tight text-[var(--foreground)] transition-colors group-hover:text-[var(--primary)]">
              {title}
            </h3>
            <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{excerpt}</p>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--muted)] text-[11px] font-semibold uppercase text-[var(--foreground)]">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  initial
                )}
              </span>
              <div className="flex flex-col text-xs">
                <span className="font-medium text-[var(--foreground)]">{author.name}</span>
                <span className="text-[var(--muted-foreground)]">{date}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
              <Clock className="h-3 w-3" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export default GlassBlogCard;
