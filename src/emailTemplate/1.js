const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    body: `
        <html>
            <body>
                <div style="display: block;padding-top: 50px;padding-left: 100px;padding-right: 100px;padding-bottom: 100px;">
                    <div style="width: 100%;text-align: center;margin-top: 20px;">
                        <span style="font-size: 12px;font-weight: 500;">Your Password was changed as bellow.</span>
                        <div> Your password is `,
    body1: `            </div>

                    </div>
                </div>
            </body>
        </html>`
}