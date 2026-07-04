import { updateSiteSettings } from "@/app/studio/actions";
import { getStudioBootstrapData } from "@/lib/cms/queries";
import { requireStudioRole } from "@/lib/studio-auth";

export default async function StudioSettingsPage() {
  await requireStudioRole(["owner", "admin"]);
  const data = await getStudioBootstrapData();
  const settings = data.settings;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-serif text-4xl text-[var(--forest)]">Settings</h1>
        <p className="mt-2 text-[var(--muted)]">Business profile, contact details, social links and default SEO.</p>
      </header>

      <form action={updateSiteSettings} className="space-y-6">
        <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h2 className="mb-4 font-serif text-xl text-[var(--ink)]">Business Profile</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Business name" name="business_name" value={settings.business_name || ""} />
            <Field label="Tagline" name="business_tagline" value={settings.business_tagline || ""} />
            <Field label="Logo image URL" name="logo_image_url" value={settings.logo_image_url || ""} />
            <Field label="Wordmark image URL" name="wordmark_image_url" value={settings.wordmark_image_url || ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h2 className="mb-4 font-serif text-xl text-[var(--ink)]">Contact & Location</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Contact email" name="contact_email" value={settings.contact_email || ""} />
            <Field label="Contact phone" name="contact_phone" value={settings.contact_phone || ""} />
            <Field label="Address line 1" name="address_line_1" value={settings.address_line_1 || ""} />
            <Field label="Address line 2" name="address_line_2" value={settings.address_line_2 || ""} />
            <Field label="Opening hours" name="opening_hours" value={settings.opening_hours || ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h2 className="mb-4 font-serif text-xl text-[var(--ink)]">Social Media</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Instagram URL" name="instagram_url" value={settings.instagram_url || ""} />
            <Field label="Facebook URL" name="facebook_url" value={settings.facebook_url || ""} />
            <Field label="Pinterest URL" name="pinterest_url" value={settings.pinterest_url || ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h2 className="mb-4 font-serif text-xl text-[var(--ink)]">SEO Defaults</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Default SEO title" name="default_seo_title" value={settings.default_seo_title || ""} />
            <Field label="Default SEO description" name="default_seo_description" value={settings.default_seo_description || ""} />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-white p-6">
          <h2 className="mb-4 font-serif text-xl text-[var(--ink)]">Footer</h2>
          <label className="space-y-1 text-sm block">
            <span className="font-medium text-[var(--ink)]">Footer text</span>
            <textarea
              name="footer_text"
              rows={3}
              defaultValue={settings.footer_text || ""}
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2"
            />
          </label>
        </div>

        <button className="rounded-full bg-[var(--forest)] px-6 py-2.5 font-semibold text-white">Save all settings</button>
      </form>
    </section>
  );
}

function Field({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <label className="space-y-1 text-sm block">
      <span className="font-medium text-[var(--ink)]">{label}</span>
      <input name={name} defaultValue={value} className="w-full rounded-lg border border-[var(--line)] px-3 py-2" />
    </label>
  );
}

