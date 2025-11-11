type Props = {
  title: string;
  description: string;
  priceFrom: string;
};

export function ServiceCard({ title, description, priceFrom }: Props) {
  return (
    <div className="p-6 rounded-lg" style={{ backgroundColor: '#a25262' }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-bold text-lg md:text-xl" style={{ color: '#faf7f2' }}>{title}</div>
          <p className="mt-3 text-base md:text-lg" style={{ color: '#faf7f2' }}>{description}</p>
        </div>
        <div className="shrink-0 rounded-md px-2 py-1 text-sm" style={{ border: '1px solid #faf7f2', color: '#faf7f2' }}>от {priceFrom}</div>
      </div>
    </div>
  );
}

