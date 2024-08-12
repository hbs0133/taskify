import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import styles from './HashtagsInput.module.scss';
import ChipCard from '@/containers/dashboard/id/chips/ChipCard';
import getRandomTagColor from '@/utils/getRandomTagColor';

interface HashTagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function HashTagsInput({ tags, setTags }: HashTagsInputProps) {
  const [textValue, setTextValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
    setError('');
  };

  const onCreate = () => {
    if (textValue.trim() === '') return;
    if (tags.length >= 5) {
      setError('태그는 최대 5개까지만 추가할 수 있습니다');
      setTextValue('');
      return;
    }
    setTags([...tags, textValue.trim()]);
    setTextValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (textValue.trim() !== '') {
        onCreate();
      }
    }
  };
  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className={styles.todoStyle}>
      <input
        className={`${styles['tags-input']} ${
          error ? styles['tags-input-error'] : styles['tags-input']
        }
        }`}
        name='textValue'
        value={textValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={error || '태그를 입력하세요 (최대 5개)'}
      />
      <div className={styles['tags']}>
        {tags.map((tag, index) => (
          <div
            onClick={() => handleTagRemove(tag)}
            style={{ cursor: 'pointer' }}
          >
            <ChipCard content={tag} color={getRandomTagColor(tag, index)} />
          </div>
        ))}
      </div>
    </div>
  );
}
