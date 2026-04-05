//@ts-nocheck

import { saveTask } from "../tasks";
import type { Task, TimeBlock } from "../types";

export const TIME_BLOCKS: TimeBlock[] = [
  { key: "morning", label: "morning", icon: "◐", hours: "6am – 12pm" },
  { key: "midday", label: "midday", icon: "●", hours: "12pm – 5pm" },
  { key: "evening", label: "evening", icon: "◑", hours: "5pm onwards" },
];