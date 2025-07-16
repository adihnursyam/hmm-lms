import { cn } from '~/lib/utils';
import Link, { type LinkProps } from 'next/link';
import Image from 'next/image';
import { FileSpreadsheet, SquarePlay } from 'lucide-react';
import { Separator } from '~/components/ui/separator';
type CoursesItemProps = {
  id: string | number;
  title: string;
  image: string;
  subject: string;
  numberOfMaterials: number;
  numberOfVideos: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
} & LinkProps;

export default function CoursesItem({
  id,
  title,
  image,
  subject,
  numberOfMaterials,
  numberOfVideos,
  orientation = 'vertical',
  className,
}: CoursesItemProps) {

  return (
    <Link
      href={`/courses/${id}`}
      className={cn(
        'rounded-lg shadow flex flex-col justify-end overflow-hidden cursor-pointer aspect-[4/5] md:aspect-[7/10] group lg:aspect-[8/10] bg-card border',
        orientation === 'horizontal' && 'md:flex-row md:aspect-[16/9] lg:aspect-[16/10]',
        className
      )}
    >
      <Image
        src={image}
        alt='item'
        width={300}
        height={200}
        className={cn('object-cover h-3/5 transition-all', orientation === 'horizontal' && 'md:h-full md:w-2/5 h-3/10 md:group-hover:w-3/10', orientation === 'vertical' && 'md:group-hover:h-11/20')}
      />
      <div className={cn('py-2 md:pt-4 px-2 md:px-4 relative transition-all overflow-hidden flex flex-col justify-between h-2/5', orientation === 'horizontal' && 'md:w-3/5 md:h-full h-7/10 md:group-hover:w-7/10', orientation === 'vertical' && 'md:group-hover:h-9/20')}>
        <div className='space-y-2'>
          <div className="flex gap-4 items-center justify-between">
            <h6 className='text-muted-foreground text-2xs md:text-xs'>{subject}</h6>
            {orientation === 'vertical' && (
              <div className="rounded-md bg-success px-2 py-0.5 text-[10px] text-white">Mandatory</div>
            )}
          </div>
          <h4 className={cn('text-xs md:text-sm font-medium text-ellipsis line-clamp-2', orientation === 'horizontal' && 'line-clamp-3')} title={title}>{title}</h4>
        </div>
        <div className='space-y-1'>
          <Separator />
          <div className='flex justify-end gap-2 items-center md:text-sm self-end text-xs'>
            <FileSpreadsheet size={10} />
            <span>{numberOfMaterials}</span>
            <SquarePlay size={10} />
            <span>{numberOfVideos}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
