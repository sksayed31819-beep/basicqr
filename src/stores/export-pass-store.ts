/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export type PassStatus = 'locked' | 'ad_prompt' | 'ad_playing' | 'active' | 'expired';

export interface ExportPassState {
  status: PassStatus;
  expiresAt: number | null;
  downloadsRemaining: number;
  passId: string | null;

  // Actions
  setStatus: (status: PassStatus) => void;
  unlockPass: () => void;
  consumeDownloadCredit: () => boolean;
  checkExpiry: () => boolean;
  resetPass: () => void;
  getTimeRemainingSeconds: () => number;
  getFormattedTimeRemaining: () => string | null;
  hasActivePass: () => boolean;
}

const STORAGE_KEY = 'basicqr_export_pass_v1';
export const PASS_DURATION_MS = 10 * 60 * 1000; // 10 minutes
export const DEFAULT_DOWNLOAD_CREDITS = 2; // 2 downloads

interface StoredPassData {
  status: PassStatus;
  expiresAt: number | null;
  downloadsRemaining: number;
  passId: string | null;
}

function loadStoredPass(): StoredPassData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPassData;
    if (parsed.status === 'active' && parsed.expiresAt && parsed.expiresAt > Date.now() && parsed.downloadsRemaining > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Could not read session pass:', err);
  }
  return null;
}

function saveStoredPass(data: StoredPassData | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!data) {
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch (err) {
    console.warn('Could not save session pass:', err);
  }
}

const initialSession = loadStoredPass();

export const useExportPassStore = create<ExportPassState>((set, get) => ({
  status: initialSession ? initialSession.status : 'locked',
  expiresAt: initialSession ? initialSession.expiresAt : null,
  downloadsRemaining: initialSession ? initialSession.downloadsRemaining : 0,
  passId: initialSession ? initialSession.passId : null,

  setStatus: (status: PassStatus) => {
    set({ status });
  },

  unlockPass: () => {
    const now = Date.now();
    const expiresAt = now + PASS_DURATION_MS;
    const passId = `pass_${now.toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const passData: StoredPassData = {
      status: 'active',
      expiresAt,
      downloadsRemaining: DEFAULT_DOWNLOAD_CREDITS,
      passId,
    };
    saveStoredPass(passData);
    set({
      status: 'active',
      expiresAt,
      downloadsRemaining: DEFAULT_DOWNLOAD_CREDITS,
      passId,
    });
  },

  consumeDownloadCredit: () => {
    const { status, expiresAt, downloadsRemaining } = get();
    const now = Date.now();

    // Verify validity before deducting
    if (status !== 'active' || !expiresAt || now >= expiresAt || downloadsRemaining <= 0) {
      get().checkExpiry();
      return false;
    }

    const nextRemaining = downloadsRemaining - 1;
    const nextStatus: PassStatus = nextRemaining <= 0 ? 'expired' : 'active';
    const updatedData: StoredPassData = {
      status: nextStatus,
      expiresAt: nextRemaining <= 0 ? null : expiresAt,
      downloadsRemaining: Math.max(0, nextRemaining),
      passId: get().passId,
    };

    saveStoredPass(nextStatus === 'active' ? updatedData : null);
    set({
      status: nextStatus,
      downloadsRemaining: Math.max(0, nextRemaining),
      expiresAt: nextRemaining <= 0 ? null : expiresAt,
    });

    return true;
  },

  checkExpiry: () => {
    const { status, expiresAt, downloadsRemaining } = get();
    if (status !== 'active') return false;

    const now = Date.now();
    const isExpired = !expiresAt || now >= expiresAt || downloadsRemaining <= 0;

    if (isExpired) {
      saveStoredPass(null);
      set({
        status: 'expired',
        expiresAt: null,
        downloadsRemaining: 0,
      });
      return true;
    }
    return false;
  },

  resetPass: () => {
    saveStoredPass(null);
    set({
      status: 'locked',
      expiresAt: null,
      downloadsRemaining: 0,
      passId: null,
    });
  },

  getTimeRemainingSeconds: () => {
    const { expiresAt, status } = get();
    if (status !== 'active' || !expiresAt) return 0;
    const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    return remaining;
  },

  getFormattedTimeRemaining: () => {
    const seconds = get().getTimeRemainingSeconds();
    if (seconds <= 0) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  hasActivePass: () => {
    const { status, expiresAt, downloadsRemaining } = get();
    if (status !== 'active' || !expiresAt) return false;
    return Date.now() < expiresAt && downloadsRemaining > 0;
  },
}));
