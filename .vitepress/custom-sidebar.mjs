// .vitepress/sidebar.js
import fs from'fs'
import path from 'path'

// 动态读取 guide 目录下的 .md 文件
function getDirSidebar(dirPath) {
    const guideDir = path.resolve(__dirname, `../${dirPath}`)
    const files = fs.readdirSync(guideDir)

    return files
        .filter(file => file.endsWith('.md') && file !== 'index.md')
        .map(file => {
            const name = file.replace('.md', '')
            return {
                text: name.charAt(0).toUpperCase() + name.slice(1), // 首字母大写
                link: `${dirPath}/${name}`
            }
        })
}

function generateSidebar(basePath) {
    return [
        { text: '概述', link: `${basePath}/` },
        {
            text: '章节',
            items: getDirSidebar(basePath)
        }
    ]
}

const SIDEBAR_PATHS = [
    '/python/python-note',
    '/docker',
    '/java/spring',
    '/数学/统计学'
]

const sidebarConfig = {}
SIDEBAR_PATHS.forEach(dirPath => {
    sidebarConfig[`${dirPath}`] = generateSidebar(dirPath)
})

console.log(sidebarConfig)

export { sidebarConfig }