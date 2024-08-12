import ButtonSetForPagination from '@/components/ButtonSetForPagination/Button';
import styles from './index.module.scss';
import { useTheme } from '@/hooks/useThemeContext';

interface PaginationProps {
  page: number;
  totalPage: number;
  onNext: () => void;
  onPrev: () => void;
}

function Pagination({ page, totalPage, onNext, onPrev }: PaginationProps) {
  const { theme } = useTheme();
  const themeStyle = styles[`${theme}`];
  const paginationStyle = {
    display: totalPage < 2 || isNaN(totalPage) ? 'none' : '',
  };
  return (
    <div
      className={`${styles['pagination']} ${themeStyle}`}
      style={paginationStyle}
    >
      <div className={styles['pagination-number']}>
        <span>{totalPage}</span> 페이지 중 <span>{page}</span>
      </div>
      <ButtonSetForPagination
        size='large'
        onClickToNext={onNext}
        onClickToPrev={onPrev}
      />
    </div>
  );
}

export default Pagination;
