// src/components/music/MusicForm.tsx

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormData } from "./Music.type";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";

const inputCls = `
  w-full px-3 py-2 rounded-lg text-[13px]
  bg-neutral-50 dark:bg-neutral-900
  border border-neutral-200 dark:border-neutral-800
  text-black dark:text-white
  placeholder:text-neutral-400 dark:placeholder:text-neutral-600
  focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600
  transition-colors
`;

const labelCls = "block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1";

const lightTheme = createTheme({
  palette: { mode: "light" },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          fontSize: "13px",
          backgroundColor: "rgb(250 250 250)",
          color: "#000",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(163 163 163)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(163 163 163)",
            borderWidth: "1px",
          },
        },
        notchedOutline: {
          borderColor: "rgb(229 229 229)",
        },
        input: {
          padding: "8px 12px",
          fontSize: "13px",
          "&::placeholder": { color: "rgb(163 163 163)", opacity: 1 },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgb(163 163 163)",
          "&:hover": { backgroundColor: "rgb(245 245 245)" },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          "&.Mui-selected": { backgroundColor: "#000 !important", color: "#fff" },
          "&.Mui-selected:hover": { backgroundColor: "#333 !important" },
        },
        today: { "&:not(.Mui-selected)": { borderColor: "#000" } },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: { fontSize: "13px", fontWeight: 500 },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: { fontSize: "11px" },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: { mode: "dark" },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          fontSize: "13px",
          backgroundColor: "rgb(10 10 10)",
          color: "#fff",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(82 82 82)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(82 82 82)",
            borderWidth: "1px",
          },
        },
        notchedOutline: { borderColor: "rgb(38 38 38)" },
        input: {
          padding: "8px 12px",
          fontSize: "13px",
          "&::placeholder": { color: "rgb(82 82 82)", opacity: 1 },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "rgb(115 115 115)",
          "&:hover": { backgroundColor: "rgb(23 23 23)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(10 10 10)",
          border: "1px solid rgb(38 38 38)",
          borderRadius: "0.75rem",
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          color: "#fff",
          "&:hover": { backgroundColor: "rgb(38 38 38)" },
          "&.Mui-selected": { backgroundColor: "#fff !important", color: "#000" },
          "&.Mui-selected:hover": { backgroundColor: "rgb(229 229 229) !important" },
        },
        today: { "&:not(.Mui-selected)": { borderColor: "#fff" } },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: { fontSize: "13px", fontWeight: 500, color: "#fff" },
        switchViewButton: { color: "#fff" },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: { fontSize: "11px", color: "rgb(115 115 115)" },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: { color: "#fff" },
      },
    },
  },
});

type MusicFormProps = {
  initial: FormData;
  onSubmit: (data: FormData) => void;
  loading: boolean;
};

export default function MusicForm({ initial, onSubmit, loading }: MusicFormProps) {
  const [form, setForm] = useState<FormData>(initial);

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p: any) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Title *</label>
          <input className={inputCls} placeholder="Song title" value={form.title} onChange={set("title")} />
        </div>
        <div>
          <label className={labelCls}>Artist *</label>
          <input className={inputCls} placeholder="Artist name" value={form.artist} onChange={set("artist")} />
        </div>
        <div>
          <label className={labelCls}>Album *</label>
          <input className={inputCls} placeholder="Album name" value={form.album} onChange={set("album")} />
        </div>
        <div>
          <label className={labelCls}>Genre *</label>
          <input className={inputCls} placeholder="e.g. Pop, Jazz" value={form.genre} onChange={set("genre")} />
        </div>
        <div>
          <label className={labelCls}>Release Date *</label>
          <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={form.releaseDate ? dayjs(form.releaseDate) : null}
                onChange={(newValue) =>
                  setForm((p: any) => ({
                    ...p,
                    releaseDate: newValue ? newValue.format("YYYY-MM-DD") : "",
                  }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    placeholder: "Pick a date",
                  },
                }}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </div>
        <div>
          <label className={labelCls}>Duration (seconds) *</label>
          <input className={inputCls} type="number" placeholder="e.g. 214" value={form.duration} onChange={set("duration")} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Cover Image URL *</label>
        <input className={inputCls} placeholder="https://..." value={form.coverImageUrl} onChange={set("coverImageUrl")} />
      </div>
      <div>
        <label className={labelCls}>Lyrics</label>
        <textarea
          className={`${inputCls} resize-none h-20`}
          placeholder="Optional lyrics..."
          value={form.lyrics}
          onChange={set("lyrics")}
        />
      </div>
      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        className="
          w-full mt-1 py-2.5 rounded-lg
          bg-black dark:bg-white
          text-white dark:text-black
          text-[13px] font-medium
          hover:opacity-80 transition-opacity
          disabled:opacity-40 flex items-center justify-center gap-2
        "
      >
        {loading && <Loader2 size={13} className="animate-spin" />}
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}