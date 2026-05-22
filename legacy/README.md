# Legacy snapshot

This folder is a complete snapshot of the funnel **before** the overlay/one-click redesign.

It contains the full prior implementation including:
- LandingPage (the full marketing landing page)
- Navbar + Footer
- The original ScheduleConsultation, Confirmation, TaxSavings, and all other pages

## When to use this

If you ever want to restore any part of the old design or the full landing-page funnel:
1. Copy individual files from `legacy/src/` back into `src/`
2. Re-add the relevant `<Route>` entries to `src/App.jsx`
3. Re-import `Navbar` / `Footer` in `App.jsx`

To fully revert to the pre-redesign state:
```bash
rm -rf src
cp -r legacy/src src
git checkout legacy/  # restores configs if needed
```

## Not bundled

This folder is **not** imported by anything in `src/`, so Vite will not include it in production builds. It exists purely as a checked-in backup.
