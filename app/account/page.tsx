import { PageHeader } from "@/components/app/PageHeader"
import { ProCard } from "@/components/subscription/ProCard"
import { ThemeSetting } from "@/components/app/ThemeSetting"

export default function AccountPage() {
  return (
    <main className="screen">
      <PageHeader title="Account" />
      <div className="flex flex-col gap-8">
        <ProCard />
        <ThemeSetting />
      </div>
    </main>
  )
}
