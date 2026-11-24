const evidence = {
  kinderbot: {
    heading: '가상 교실에서 같은 준비 요청을 두 번 실행했습니다',
    rows: [
      ['테이블에 놓은 교구', '두 번 모두 4개 중 4개', '토마토 2개와 생선 2개를 요청했습니다. 완료 기준은 선반에서 집은 시점이 아니라 트레이에 놓고 안정된 시점입니다.'],
      ['웹 요청부터 완료까지', '6분 15.0초 / 6분 16.2초', '두 번째는 시뮬레이터를 다시 켜고 같은 요청을 보냈습니다. 프로그램을 켜는 시간은 제외했습니다.'],
    ],
    source: '팀 통합 시험 기록 · 2026.09.26. Isaac Sim에서 역기구학(IK) 제어와 운반 중 교구를 고정하는 물리 제약을 사용했습니다. 실물 로봇팔이나 학습 정책의 성공률이 아닙니다.',
  },
  cadflow: {
    heading: '라이브러리 생성 시간과 기존 파일의 일치 항목',
    rows: [
      ['버전별 생성 시간', '143분 → 68분 → 3분', '초기 버전은 모델이 도형까지 그렸습니다. 최종 버전은 핀과 치수만 모델로 읽고, 좌표 계산과 파일 생성은 Python에 맡겼습니다. 초기 버전 대비 97.9% 단축한 발표 사례입니다.'],
      ['기존 파일과 대조', '436개 중 419개 일치 (96.1%)', '팀이 기존 라이브러리와 대조한 네 종류의 판정 가능 항목 중 17개는 일치하지 않았습니다. 부품 436종에 대한 정확도나 제작 승인율을 뜻하지 않습니다.'],
    ],
    source: '팀 최종 발표 39–42쪽 · 생성 시간은 발표에 제시한 버전별 사례 값입니다. 여러 부품의 평균이나 수작업 대비 절감 시간으로 계산하지 않았습니다.',
  },
}
export default function CaseMeasurements({slug}) {
  const e=evidence[slug]; if(!e)return null
  return <section className="case-measurements" aria-label="팀 시험 및 비교 결과"><h3>{e.heading}</h3><dl>{e.rows.map(([label,value,detail])=><div key={label}><dt>{label}</dt><dd><strong>{value}</strong><p>{detail}</p></dd></div>)}</dl><p className="cm-source">{e.source}</p></section>
}
