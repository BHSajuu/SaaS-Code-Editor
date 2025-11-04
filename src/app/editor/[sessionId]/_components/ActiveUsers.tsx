"use client";

import { motion, AnimatePresence } from "framer-motion";

type ActiveUser = {
  userId: string;
  userName: string;
  userImageUrl: string;
};

export default function ActiveUsers({ activeUsers }: { activeUsers: ActiveUser[] }) {
  return (
    <div className="flex items-center -space-x-2">
      <AnimatePresence>
        {activeUsers.map((user, index) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            title={user.userName}
            style={{ zIndex: activeUsers.length - index }}
          >
            <img
              src={user.userImageUrl}
              alt={user.userName}
              className="w-9 h-9 rounded-full border-2 border-[#0a0a0f] ring-1 ring-blue-400"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}