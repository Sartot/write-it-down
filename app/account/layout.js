export default async function AccountLayout({children}){
    return (
        <div className="dark:bg-sidebar dark:text-white">
            {children}
        </div>
    )
}