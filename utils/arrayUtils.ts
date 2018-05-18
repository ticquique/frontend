'use strict';

export const arrayMove = (x: any[], from: number, to: number) => {
    x = x.slice();
    x.splice((to < 0 ? x.length + to : to), 0, x.splice(from, 1)[0]);
    return x;
};
