import { useInfiniteQuery } from '@tanstack/react-query';
import { todoListApi } from './api';
import { useCallback, useRef } from 'react';

export function TodoList() {
    const {
        data: todoItems,
        error,
        isPending,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        ...todoListApi.getTodoListInfinityQueryOptions(),
        enabled: true
    });

    const cursorRef = useIntersection(() => {
        fetchNextPage();
    });

    if (isPending) return <div>Loading...</div>;

    if (error) return <div>error: {JSON.stringify(error)}</div>;

    return (
        <div className="p-10 mx-auto max-w-[1200px] mt-10">
            <h1 className="text-3xl font-bold underline mb-5">Todo List</h1>

            <div className="flex flex-col gap-4">
                {todoItems?.map((todo, i) => (
                    <div
                        className="border border-slate-300 rounded p-3"
                        key={i}
                    >
                        {todo.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-4" ref={cursorRef}>
                {!hasNextPage && <div>Нет данных для загрузки </div>}
                {isFetchingNextPage && <div>...Loading</div>}
            </div>
        </div>
    );
}

function useIntersection(onIntersect: () => void) {
    const unsubscribe = useRef(() => {});

    return useCallback(
        (el: HTMLDivElement) => {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(intersection => {
                    if (intersection.isIntersecting) {
                        onIntersect();
                    }
                });
            });
            if (observer) {
                observer.observe(el);
                unsubscribe.current = () => observer.disconnect;
            } else {
                unsubscribe.current();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
}
