# VELORA 2.0

Static multi-page site (HTML + ES modules). No build step. Deploy by copying this folder's contents to the root of your GitHub Pages branch. All links are relative, so it works under `/<repo>/`. `404.html` is included. Deployment settings and branch are untouched.

## Required before it works
`assets/js/config.js` is prefilled with the existing public **publishable** key. Optionally set `CONTACT_EMAIL`. Never replace it with a service-role key.
In Supabase → Authentication → URL Configuration add your site URL and `…/app/dashboard.html`, `…/reset-password.html` as redirect URLs. Enable Google/Apple providers there.

## Structure
```
index, features, tools, how-it-works, about, faq, contact, privacy, terms .html
login, signup, forgot-password, reset-password .html
app/ dashboard, tools, history, profile, settings .html
app/tools/ upscale, background-removal, convert, resize, restore, bulk, compress .html
assets/css/velora.css
assets/js/ main.js, config.js
  components/ layout, ui, tool-widget, compare, charts
  services/ auth, profile, usage, images, zip
  pages/ home, tools, auth, dashboard, app-tools, app-tool, history, profile, settings
```

## Database mapping (as given)
profiles(id, display_name, avatar_url, created_at) · daily_usage(user_id, tool_key, usage_date, usage_count) · tool_limits(tool_key, daily_limit) · image_jobs(user_id, tool_key, original_file_name, status, metadata, created_at) · rpc consume_daily_usage(p_tool_key) · rpc get_dashboard_stats() → daily_used, daily_limit, images_processed.
Tool keys: upscale, background_removal, format_conversion, smart_resize, restoration, bulk_optimization, compression.

## Quota flow
Pre-check remaining (read only) → process in browser → on success call `consume_daily_usage` → only if it returns `allowed: true`, show results and log `image_jobs`. Signed-in users are tracked on both public and workspace tool pages; guests remain untracked. Processing failures never call the RPC. If the RPC refuses, results are withheld.
`image_jobs.status` values written: `completed`, `failed` (assumed; adjust in `components/tool-widget.js` if a check constraint differs).

## Avatars
Uploads to the private `velora-images` bucket at `<user_id>/avatar-<time>.<ext>` and stores the storage path in `profiles.avatar_url`. The app creates a fresh signed URL when loading the profile. Ensure authenticated users have INSERT and SELECT policies on `storage.objects` restricted to `(storage.foldername(name))[1] = auth.uid()::text`. Do not make the bucket public just for avatars.
