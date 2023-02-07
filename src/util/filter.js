import dayjs from 'dayjs';
import {FilterType} from '../const';

const filter = {
  [FilterType.EVERYTHING]: (tasks) => tasks.filter((task) => !task.isArchive),
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.end))),
};

export {filter};
