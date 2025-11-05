"use client";

import { Check, Copy, Loader2, Lock,  Send, UserPlus, Users, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useDebounce } from "@/hooks/useDebounce";



interface ShareSessionModalProps {
  sessionId: string;
  onClose: () => void;
}

export default function ShareSessionModal({ sessionId, onClose }: ShareSessionModalProps) {
  const [sessionUrl, setSessionUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const { user } = useUser();
  const session = useQuery(api.sessions.get, { sessionId: sessionId as Id<"sessions"> });
  const allUsers = useQuery(api.users.getUsers); 
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchResults = useQuery(api.users.searchUsers, { query: debouncedSearchQuery });
  
  const updateAccess = useMutation(api.sessions.updateSessionAccess);
  const addUser = useMutation(api.sessions.addUserToSession);
  const removeUser = useMutation(api.sessions.removeUserFromSession);
  const sendEmail = useMutation(api.sessions.sendEmailInvite);
  
  const isOwner = session?.ownerId === user?.id;
  const isPublic = session?.isPublic || false;

  // Compute the list of allowed users for this session
  type AllowedUser = { userId: string; name: string; email: string };
  const allowedUsers = useMemo<AllowedUser[]>(() => {
    if (!session || !allUsers) return [];
    const allowed = new Set(session.allowedUsers);
    return allUsers.filter((u) => allowed.has(u.userId));
  }, [session, allUsers]);

  useEffect(() => {
    setSessionUrl(window.location.href);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAccessToggle = async () => {
    if (!isOwner) return;
    setIsUpdating(true);
    try {
      await updateAccess({
        sessionId: sessionId as Id<"sessions">,
        isPublic: !isPublic,
      });
      toast.success(
        `Session is now ${!isPublic ? "public (editable by all)" : "private"}`
      );
    } catch (error) {
      toast.error("Failed to update access.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddUser = async (userId: string) => {
    try {
      await addUser({ sessionId: sessionId as Id<"sessions">, userId });
      toast.success("User added!");
      setSearchQuery("");
    } catch (error) {
      toast.error("Failed to add user.");
    }
  };

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeUser({ sessionId: sessionId as Id<"sessions">, userId });
      toast.success("User removed.");
    } catch (error) {
      toast.error("Failed to remove user.");
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsSendingEmail(true);
    try {
      await sendEmail({
        sessionId: sessionId as Id<"sessions">,
        email: inviteEmail,
      });
      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (error) {
      toast.error("Failed to send invite.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-[#0c0c18] rounded-4xl border border-gray-800/50 w-full max-w-lg p-6 shadow-lg hover:shadow-2xl shadow-blue-400/30 hover:shadow-blue-300/30 transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Share Session</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">
              Copy the link to invite others:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={sessionUrl}
                readOnly
                className="w-full px-3 py-2 bg-[#12121a] border border-[#313244] rounded-lg text-gray-300 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg transition-all text-white font-medium ${
                  isCopied
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          
          {isOwner && (
            <div className="space-y-4">
              <div className="p-4 bg-[#12121a] rounded-lg border border-gray-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPublic ? (
                      <Users className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="font-medium text-white">
                        {isPublic ? "Public Access" : "Private Session"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {isPublic
                          ? "Anyone with the link can edit."
                          : "Only you and allowed users can edit."}
                      </p>
                    </div>
                  </div>
                  {isUpdating ? (
                    <Loader2 className="w-5 h-5 text-gray-400 loader-spin" />
                  ) : (
                    <button
                      onClick={handleAccessToggle}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isPublic ? "bg-blue-600" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isPublic ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>

             
              <form onSubmit={handleSendEmail} className="flex items-center gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Invite user by email..."
                  className="w-full px-3 py-2 bg-[#12121a] border border-[#313244] rounded-lg text-gray-300 focus:outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {isSendingEmail ? <Loader2 className="w-5 h-5 loader-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </form>

             
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users to add..."
                  className="w-full px-3 py-2 bg-[#12121a] border border-[#313244] rounded-lg text-gray-300 focus:outline-none placeholder-gray-500"
                />
                {searchResults && searchResults.length > 0 && (
                  <div className="absolute w-full mt-1 bg-[#2a2a3a] border border-gray-700 rounded-lg max-h-40 overflow-y-auto z-10">
                    {searchResults.map((userResult) => (
                      <div
                        key={userResult.userId}
                        className="flex items-center justify-between p-2 hover:bg-blue-500/10"
                      >
                        <span className="text-sm text-gray-300">{userResult.name} ({userResult.email})</span>
                        <button
                          onClick={() => handleAddUser(userResult.userId)}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Allowed Users List */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-400">Allowed Users:</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {allowedUsers.length > 0 ? (
                    allowedUsers.map((allowedUser) => (
                      <div
                        key={allowedUser.userId}
                        className="flex items-center justify-between p-2 bg-[#12121a] rounded-lg"
                      >
                        <span className="text-sm text-gray-300">{allowedUser.name}</span>
                        <button
                          onClick={() => handleRemoveUser(allowedUser.userId)}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-2">
                      No users added.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}