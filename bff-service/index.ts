import * as dotenv from 'dotenv';
dotenv.config()
import express from 'express'
import cors from 'cors'
import axios, { AxiosRequestConfig, Method } from 'axios'
import NodeCache from 'node-cache';


const TIME_TO_CHECK = 120;
const app = express();
const PORT = process.env.PORT || 3000;
const servicesCache = new NodeCache({
  stdTTL: TIME_TO_CHECK,
  checkperiod: TIME_TO_CHECK,
});

const SERVICES_TO_CACHE = ['product']

app.use(express.json());
app.use(cors());

app.all('/*', (req, res) => {
    console.log('Running BFF', req.originalUrl, req.method, req.body)

	const [, recepient, ...restUrlParams] = req.originalUrl.split('/');
    const targetUrl = process.env[recepient];

	if (targetUrl) {
		if (req.method === 'GET' && SERVICES_TO_CACHE.includes(recepient)) {
			if (servicesCache.has(req.originalUrl)) {
                console.log('Found cached data', req.originalUrl)
                res.json(servicesCache.get(req.originalUrl));
                return;
			}
		}

        const resultUrl = [targetUrl, ...restUrlParams].join('/')
        console.log('Forward to', resultUrl);
		const axiosConfig: AxiosRequestConfig = {
			method: req.method as Method,
			url: resultUrl,
			...(Object.keys(req.body || {}).length > 0 && {data: req.body})
		};

		axios(axiosConfig)
			.then(response => {
				if (req.method === 'GET' && SERVICES_TO_CACHE.includes(recepient)) {
					if (!servicesCache.has(req.originalUrl)) {
                        console.log('Set cache data', req.originalUrl)
                        servicesCache.set(req.originalUrl, response.data);
					}
				}
				res.json(response.data);
			})
			.catch(error => {
				if (error.response) {
					const {
						status,
						data
					} = error.response;

					res.status(status).json(data);
				} else {
					res.status(500).json({error: error.message});
				}
			});
	} else {
		res.status(502).json({error: 'Cannot process request'});
	}
});

app.listen(PORT, () => {
	console.log(`BFF service is listening at localhost: ${PORT}`);
})
