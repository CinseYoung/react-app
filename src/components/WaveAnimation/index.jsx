import React from 'react'
import styles from './style.less'

export default class WaveAnimation extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className={styles.waveAnimation}>
				<svg className={styles.svg1}>
					<g>
						<path d="M 0 70 Q 75 39, 150 70 T 300 70 T 450 70 T 600 70 T 750 70 V 100 H 0 V 0" fill="#fff">
						</path>
						<animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-300" dur="6s" repeatCount="indefinite"/>
					</g>
				</svg>
				<svg className={styles.svg2}>
					<g>
						<path d="M 0 70 Q 75 39, 150 70 T 300 70 T 450 70 T 600 70 T 750 70 V 100 H 0 V 0" fill="#fff">
						</path>
						<animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-300" dur="4.5s" restart="never" repeatCount="indefinite"/>
						<animate attributeName="opacity" values="0.2; 1; 0.2" dur="4.5s" repeatCount="indefinite" />
						<animateTransform attributeName="transform" dur="4.5s" type="scale" values="1; 1.5; 1" repeatCount="1"/>
					</g>
				</svg>
				<svg className={styles.svg3}>
					<g>
						<path d="M 0 70 Q 75 39, 150 70 T 300 70 T 450 70 T 600 70 T 750 70 V 100 H 0 V 0" fill="#fff">
						</path>
						<animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-300" dur="4s" repeatCount="indefinite"/>
						<animate attributeName="opacity" values="0.2; 1; 0.2" dur="4s" repeatCount="indefinite" />
					</g>
				</svg>
				<svg className={styles.svg4}>
					<g>
						<path d="M 0 70 Q 75 39, 150 70 T 300 70 T 450 70 T 600 70 T 750 70 V 100 H 0 V 0" fill="#fff">
						</path>
						<animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-300" dur="5.5s" repeatCount="indefinite"/>
					</g>
				</svg>
			</div>
		)
	}
}