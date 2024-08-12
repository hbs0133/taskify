import Image from 'next/image';
import ChipCard from '../chips/ChipCard';
import styles from './Card.module.scss';
import { IconCalender } from '@/assets/icongroup';
import getDate from '@/utils/getDate';

import TodoModal from '../modals/todoModal/TodoModal';
import useTodoModalStore from '@/stores/todoModalStore';
import useTodoEditModalStore from '@/stores/useTodoEditModalStore';
import TodoEditModal from '../modals/todoEditModal/TodoEditModal';
import { Draggable } from '@hello-pangea/dnd';
import classNames from 'classNames';
import getRandomTagColor from '@/utils/getRandomTagColor';
import { useTheme } from '@/hooks/useThemeContext';
import { ProfileIcon } from '@/components/ProfileIcon/ProfileIcon';

function Card({ card }: { card: ICard }) {
  const { id, title, tags, dueDate, imageUrl, assignee } = card;
  const { TodoModalId, setOpenTodoModal } = useTodoModalStore();
  const { EditModalId } = useTodoEditModalStore();
  const { theme } = useTheme();

  return (
    <>
      <Draggable draggableId={String(id)} index={id}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            // isDragging={snapshot.isDragging}
            className={classNames(
              styles['card'],
              snapshot.isDragging ? styles['is-dragging'] : null,
              styles[theme],
            )}
            onClick={() => setOpenTodoModal(id)}
          >
            {imageUrl && (
              <Image
                src={imageUrl}
                alt='image'
                width={274}
                height={160}
                priority
              />
            )}
            <div className={styles['card-content']}>
              <p className={styles['title']}>{title}</p>
              <div className={styles['card-information']}>
                <>
                  {tags.length > 0 && (
                    <div className={styles['tags']}>
                      {tags.map((tag, idx) => (
                        <ChipCard
                          content={tag}
                          color={getRandomTagColor(tag, id)}
                          key={idx}
                        />
                      ))}
                    </div>
                  )}
                </>
                <div className={styles['card-bottom']}>
                  <div className={styles['date']}>
                    <IconCalender width={18} height={18} />
                    <p className={styles['small-txt']}>{getDate(dueDate)}</p>
                  </div>
                  {assignee ? (
                    <ProfileIcon
                      nickname={assignee.nickname}
                      imageUrl={assignee.profileImageUrl}
                    />
                  ) : (
                    <p className={styles['small-txt']}>담당자 미정</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      {TodoModalId === id && <TodoModal card={card} />}
      {EditModalId === card.id ? <TodoEditModal card={card} /> : <></>}
    </>
  );
}

export default Card;
