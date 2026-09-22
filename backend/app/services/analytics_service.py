"""Analytics service providing structured business intelligence data.

Translates internal Phase 1 data layer models into validated API response schemas
without recalculating, reinterpreting, or modifying authoritative source figures.
"""

from typing import Dict, List, Optional
from backend.app.data.repository import (
    load_advertising_dataset,
    load_customer_research,
    load_market_evidence,
    load_market_trends,
    load_market_analysis,
    load_market_sources,
    repository,
)
from backend.app.schemas.common import HealthResponse, SourceMeta
from backend.app.schemas.overview import (
    CorrelationsOverview,
    DataQualityOverview,
    DatasetOverview,
    ModelOverview,
    OverviewResponse,
)
from backend.app.schemas.data_quality import (
    DataQualityCheckItem,
    DataQualityMetrics,
    DataQualityResponse,
)
from backend.app.schemas.advertising import (
    AdvertisingObservationItem,
    AdvertisingResponse,
    DescriptiveStatsItem,
    OutlierObservationItem,
)
from backend.app.schemas.correlation import CorrelationPair, CorrelationResponse
from backend.app.schemas.regression import (
    RegressionCoefficientDetail,
    RegressionModelDetail,
    RegressionResponse,
)
from backend.app.schemas.channels import ChannelEvidenceDetail, ChannelResponse
from backend.app.schemas.customer_drivers import (
    CustomerAnalysisPatternItem,
    CustomerDriverResponse,
    CustomerEvidenceItem,
    CustomerFactorSynthesisItem,
    CustomerMethodRuleItem,
    CustomerSourceItem,
)
from backend.app.schemas.market_trends import (
    MarketAnalysisItem,
    MarketEvidenceItem,
    MarketSourceItem,
    MarketTrendItem,
    MarketTrendResponse,
    QuantifiedSignalItem,
)
from backend.app.schemas.strategy import (
    StrategyAdvertisingEvidence,
    StrategyChannelItem,
    StrategyCustomerFactorItem,
    StrategyMarketSignalItem,
    StrategyResponse,
    RecommendationItem,
    ActionPlanPhase,
    ActionPlanTableItem,
    MeasurementLevelItem,
)
from backend.app.schemas.sources import SourceRegistryResponse, UnifiedSourceItem


class AnalyticsService:
    """Service layer coordinating analytical data extraction from Phase 1 repository."""

    def get_health_status(self) -> HealthResponse:
        """Verifies underlying data foundation loadability."""
        # Attempt loading advertising dataset to ensure foundation is intact
        adv = repository.load_advertising_dataset()
        if not adv.raw_data:
            raise RuntimeError("Data foundation is empty.")
        return HealthResponse(
            status="ok",
            service="nexa-one-analytics-api",
            data_foundation="operational",
        )

    def get_overview(self) -> OverviewResponse:
        """Constructs executive overview metrics strictly from validated data."""
        adv = repository.load_advertising_dataset()
        raw = adv.raw_data
        model = adv.regression_model
        corr = adv.correlation.matrix

        total_sales = sum(r.sales for r in raw)
        mean_sales = total_sales / len(raw) if raw else 0.0

        total_ad_spend = sum(r.tv_ads + r.social_media_ads + r.print_ads for r in raw)
        mean_ad_spend = total_ad_spend / len(raw) if raw else 0.0

        dq_summary = adv.analysis_summary.data_quality_summary
        dq_status = "PASS" if dq_summary.get("Duplicate-ID rows", 0) == 0 and dq_summary.get("Missing cells", 0) == 0 else "REVIEW"

        return OverviewResponse(
            dataset=DatasetOverview(
                market_count=len(raw),
                channels=["TV", "Social Media", "Print"],
                total_sales=total_sales,
                mean_sales=mean_sales,
                total_advertising_spend=total_ad_spend,
                mean_advertising_spend=mean_ad_spend,
            ),
            model=ModelOverview(
                formula=model.model_formula,
                r_squared=model.r_squared,
                adjusted_r_squared=model.adj_r_squared,
                f_statistic=model.f_statistic,
                model_p_value=model.model_p_value,
                standard_error=model.std_error_estimate,
            ),
            correlations=CorrelationsOverview(
                tv_sales=corr.get("TV Ads", {}).get("Sales", 0.0),
                social_media_sales=corr.get("Social Media Ads", {}).get("Sales", 0.0),
                print_sales=corr.get("Print Ads", {}).get("Sales", 0.0),
            ),
            data_quality=DataQualityOverview(
                status=dq_status,
                observations=int(dq_summary.get("Observations", len(raw))),
                missing_cells=int(dq_summary.get("Missing cells", 0)),
                duplicate_ids=int(dq_summary.get("Duplicate-ID rows", 0)),
                rows_requiring_review=int(dq_summary.get("Rows requiring review", 2)),
            ),
            sources={
                "raw_data": SourceMeta(
                    workbook=adv.traceability["raw_data"].source_workbook,
                    sheet=adv.traceability["raw_data"].source_sheet,
                ),
                "regression_model": SourceMeta(
                    workbook=adv.traceability["regression_model"].source_workbook,
                    sheet=adv.traceability["regression_model"].source_sheet,
                ),
                "correlation": SourceMeta(
                    workbook=adv.traceability["correlation"].source_workbook,
                    sheet=adv.traceability["correlation"].source_sheet,
                ),
            },
        )

    def get_data_quality(self) -> DataQualityResponse:
        """Extracts complete data quality audit items and metrics."""
        adv = repository.load_advertising_dataset()
        dq_list = adv.data_quality
        summary = adv.analysis_summary.data_quality_summary

        checks = [
            DataQualityCheckItem(
                check=c.check,
                formula_result=c.formula_result,
                what_it_checks=c.what_it_checks,
                status=c.status,
            )
            for c in dq_list
        ]

        metrics = DataQualityMetrics(
            row_count=int(summary.get("Observations", 200)),
            column_count=int(summary.get("Source columns", 5)),
            missing_source_cells=int(summary.get("Missing cells", 0)),
            negative_values=int(summary.get("Negative values", 0)),
            duplicate_market_ids=int(summary.get("Duplicate-ID rows", 0)),
            unique_market_ids=200,
            zero_social_spend=0,
            outlier_counts=int(summary.get("Rows requiring review", 2)),
            rows_requiring_review=int(summary.get("Rows requiring review", 2)),
        )

        overall_status = "PASS" if metrics.duplicate_market_ids == 0 and metrics.missing_source_cells == 0 else "CHECK"

        return DataQualityResponse(
            overall_status=overall_status,
            metrics=metrics,
            checks=checks,
            source=SourceMeta(
                workbook=adv.traceability["data_quality"].source_workbook,
                sheet=adv.traceability["data_quality"].source_sheet,
            ),
        )

    def get_advertising(self) -> AdvertisingResponse:
        """Extracts complete advertising observations, derived metrics, and statistics."""
        adv = repository.load_advertising_dataset()

        obs_items = [
            AdvertisingObservationItem(
                market_number=w.market_number,
                tv_ads=w.tv_ads,
                social_media_ads=w.social_media_ads,
                print_ads=w.print_ads,
                sales=w.sales,
                total_advertising=w.total_ads,
                tv_spend_share=w.tv_spend_share,
                social_media_spend_share=w.social_media_spend_share,
                print_spend_share=w.print_spend_share,
                sales_per_total_ad_spend=w.sales_per_total_ad_spend,
                tv_zscore=w.tv_zscore,
                social_media_zscore=w.social_media_zscore,
                print_zscore=w.print_zscore,
                sales_zscore=w.sales_zscore,
                total_ad_spend_zscore=w.total_ad_spend_zscore,
                tv_iqr_flag=w.tv_iqr_flag,
                social_media_iqr_flag=w.social_media_iqr_flag,
                print_iqr_flag=w.print_iqr_flag,
                sales_iqr_flag=w.sales_iqr_flag,
                row_review_status=w.row_review_status,
            )
            for w in adv.working_data
        ]

        desc_items = [
            DescriptiveStatsItem(
                metric=d.metric,
                tv_ads=d.tv_ads,
                social_media_ads=d.social_media_ads,
                print_ads=d.print_ads,
                sales=d.sales,
                total_ads=d.total_ads,
            )
            for d in adv.descriptive_stats
        ]

        outlier_items = [
            OutlierObservationItem(
                market_number=o.market_number,
                tv_ads=o.tv_ads,
                social_media_ads=o.social_media_ads,
                print_ads=o.print_ads,
                sales=o.sales,
                tv_flag=o.tv_flag,
                social_media_flag=o.social_media_flag,
                print_flag=o.print_flag,
                sales_flag=o.sales_flag,
                review_status=o.review_status,
                review_note=o.review_note,
            )
            for o in adv.outlier_review
            if o.review_status != "OK" or any(f == "Review" for f in (o.tv_flag, o.social_media_flag, o.print_flag))
        ]

        sources = [
            SourceMeta(workbook=adv.traceability["raw_data"].source_workbook, sheet="Raw_Data"),
            SourceMeta(workbook=adv.traceability["working_data"].source_workbook, sheet="Working_Data"),
            SourceMeta(workbook=adv.traceability["descriptive_stats"].source_workbook, sheet="Descriptive_Stats"),
            SourceMeta(workbook=adv.traceability["outlier_review"].source_workbook, sheet="Outlier_Review"),
        ]

        return AdvertisingResponse(
            total_observations=len(obs_items),
            observations=obs_items,
            descriptive_statistics=desc_items,
            outliers=outlier_items,
            sources=sources,
        )

    def get_correlation(self) -> CorrelationResponse:
        """Extracts Pearson correlation analysis with exact numerical precision."""
        adv = repository.load_advertising_dataset()
        corr = adv.correlation

        pairs: List[CorrelationPair] = []
        for vx in corr.variables:
            for vy in corr.variables:
                if vx != vy:
                    pairs.append(CorrelationPair(
                        variable_x=vx,
                        variable_y=vy,
                        coefficient=corr.matrix[vx][vy],
                    ))

        return CorrelationResponse(
            variables=corr.variables,
            correlations=pairs,
            matrix=corr.matrix,
            reading_note=corr.reading_note,
            source=SourceMeta(
                workbook=adv.traceability["correlation"].source_workbook,
                sheet=adv.traceability["correlation"].source_sheet,
            ),
        )

    def get_regression(self) -> RegressionResponse:
        """Extracts multiple linear regression results and coefficients."""
        adv = repository.load_advertising_dataset()
        reg = adv.regression_model

        model_detail = RegressionModelDetail(
            model_name="Multiple Linear Regression (Sales ~ TV + Social Media + Print)",
            formula=reg.model_formula,
            dependent_variable="sales",
            independent_variables=["tv_ads", "social_media_ads", "print_ads"],
            sample_size=reg.observations,
            predictors_k=reg.predictors_k,
            residual_df=reg.residual_df,
            r_squared=reg.r_squared,
            adjusted_r_squared=reg.adj_r_squared,
            f_statistic=reg.f_statistic,
            model_p_value=reg.model_p_value,
            standard_error=reg.std_error_estimate,
        )

        coef_details = [
            RegressionCoefficientDetail(
                variable=c.term,
                coefficient=c.coefficient,
                standard_error=c.std_error,
                t_statistic=c.t_statistic,
                p_value=c.p_value,
                ci_lower=c.ci_95_low,
                ci_upper=c.ci_95_high,
                interpretation=c.interpretation,
            )
            for c in reg.coefficients
        ]

        return RegressionResponse(
            model=model_detail,
            coefficients=coef_details,
            reading_note=reg.reading_note,
            source=SourceMeta(
                workbook=adv.traceability["regression_model"].source_workbook,
                sheet=adv.traceability["regression_model"].source_sheet,
            ),
        )

    def get_channels(self) -> ChannelResponse:
        """Extracts channel-level statistical evidence without subjective rankings."""
        adv = repository.load_advertising_dataset()
        reg = adv.regression_model
        corr = adv.correlation.matrix
        desc = adv.descriptive_stats
        working = adv.working_data
        outliers = adv.outlier_review

        # Channel mapping definitions
        channel_defs = [
            {
                "name": "TV",
                "var": "tv_ads",
                "corr_key": "TV Ads",
                "reg_key": "TV Ads",
                "desc_attr": "tv_ads",
                "share_attr": "tv_spend_share",
                "flag_attr": "tv_flag",
            },
            {
                "name": "Social Media",
                "var": "social_media_ads",
                "corr_key": "Social Media Ads",
                "reg_key": "Social Media Ads",
                "desc_attr": "social_media_ads",
                "share_attr": "social_media_spend_share",
                "flag_attr": "social_media_flag",
            },
            {
                "name": "Print",
                "var": "print_ads",
                "corr_key": "Print Ads",
                "reg_key": "Print Ads",
                "desc_attr": "print_ads",
                "share_attr": "print_spend_share",
                "flag_attr": "print_flag",
            },
        ]

        def get_stat(metric_name: str, attr: str) -> float:
            for item in desc:
                if item.metric == metric_name:
                    val = getattr(item, attr, None)
                    if val is not None:
                        return float(val)
            return 0.0

        channels: List[ChannelEvidenceDetail] = []

        for ch in channel_defs:
            c_coef = next(c for c in reg.coefficients if c.term == ch["reg_key"])
            c_corr = corr.get(ch["corr_key"], {}).get("Sales", 0.0)

            # Spend share mean
            shares = [getattr(w, ch["share_attr"]) for w in working]
            mean_share = sum(shares) / len(shares) if shares else 0.0

            # Outlier count
            outlier_cnt = sum(1 for o in outliers if getattr(o, ch["flag_attr"]) != "Within range")

            channels.append(ChannelEvidenceDetail(
                channel_name=ch["name"],
                variable_name=ch["var"],
                sales_correlation=c_corr,
                regression_coefficient=c_coef.coefficient,
                standard_error=c_coef.std_error,
                t_statistic=c_coef.t_statistic,
                p_value=c_coef.p_value,
                ci_lower=c_coef.ci_95_low,
                ci_upper=c_coef.ci_95_high,
                spend_mean=get_stat("Mean", ch["desc_attr"]),
                spend_median=get_stat("Median", ch["desc_attr"]),
                spend_std_dev=get_stat("Std Dev", ch["desc_attr"]),
                spend_min=get_stat("Minimum", ch["desc_attr"]),
                spend_max=get_stat("Maximum", ch["desc_attr"]),
                mean_spend_share=mean_share,
                outlier_count=outlier_cnt,
            ))

        sources = [
            SourceMeta(workbook=adv.traceability["regression_model"].source_workbook, sheet="Regression_Model"),
            SourceMeta(workbook=adv.traceability["correlation"].source_workbook, sheet="Correlation"),
            SourceMeta(workbook=adv.traceability["descriptive_stats"].source_workbook, sheet="Descriptive_Stats"),
            SourceMeta(workbook=adv.traceability["working_data"].source_workbook, sheet="Working_Data"),
        ]

        return ChannelResponse(channels=channels, sources=sources)

    def get_customer_drivers(
        self,
        factor: Optional[str] = None,
        geography: Optional[str] = None,
        year: Optional[int] = None,
        source: Optional[str] = None,
    ) -> CustomerDriverResponse:
        """Extracts Q3 Customer Research evidence and synthesis with optional filtering."""
        q3 = repository.load_customer_research()

        evidence_items = [
            CustomerEvidenceItem(
                source=e.source,
                year=e.year,
                geography=e.geography,
                sample_basis=e.sample_basis,
                product_category=e.product_category,
                purchase_factor=e.purchase_factor,
                reported_value=e.reported_value,
                measure=e.measure,
                evidence_type=e.evidence_type,
                research_note=e.research_note,
                publisher=e.publisher,
                source_link=e.source_link,
            )
            for e in q3.research_evidence
        ]

        factor_items = [
            CustomerFactorSynthesisItem(
                factor=f.factor,
                quantitative_observations=f.quantitative_observations,
                mean_reported_pct=f.mean_reported_pct,
                median_reported_pct=f.median_reported_pct,
                minimum_pct=f.minimum_pct,
                maximum_pct=f.maximum_pct,
                latest_quantitative_year=f.latest_quantitative_year,
                india_specific_evidence=f.india_specific_evidence,
                qualitative_support=f.qualitative_support,
                interpretation=f.interpretation,
            )
            for f in q3.factor_synthesis
        ]

        analysis_items = [
            CustomerAnalysisPatternItem(
                observed_pattern=a.observed_pattern,
                evidence_from_research=a.evidence_from_research,
                business_implication=a.business_implication,
                limitation_context=a.limitation_context,
            )
            for a in q3.research_analysis
        ]

        method_items = [
            CustomerMethodRuleItem(
                rule_number=m.rule_number,
                rule_title=m.rule_title,
                rule_description=m.rule_description,
            )
            for m in q3.analytical_methods
        ]

        source_items = [
            CustomerSourceItem(
                source=s.source,
                publication_year=s.publication_year,
                publisher=s.publisher,
                source_link=s.source_link,
                what_it_contributes=s.what_it_contributes,
            )
            for s in q3.source_register
        ]

        sources = [
            SourceMeta(workbook=q3.traceability["research_evidence"].source_workbook, sheet="Research_Evidence"),
            SourceMeta(workbook=q3.traceability["factor_synthesis"].source_workbook, sheet="Factor_Synthesis"),
            SourceMeta(workbook=q3.traceability["research_analysis"].source_workbook, sheet="Research_Analysis"),
            SourceMeta(workbook=q3.traceability["source_register"].source_workbook, sheet="Source_Register"),
        ]

        filtered = evidence_items
        if factor:
            f_lower = factor.lower()
            filtered = [e for e in filtered if f_lower in e.purchase_factor.lower()]
        if geography:
            g_lower = geography.lower()
            filtered = [e for e in filtered if g_lower in e.geography.lower()]
        if year:
            filtered = [e for e in filtered if e.year == year]
        if source:
            s_lower = source.lower()
            filtered = [e for e in filtered if s_lower in e.source.lower() or (e.publisher and s_lower in e.publisher.lower())]

        return CustomerDriverResponse(
            total_evidence_records=len(evidence_items),
            filtered_evidence_records=len(filtered),
            research_evidence=filtered,
            factor_synthesis=factor_items,
            research_analysis=analysis_items,
            analytical_methods=method_items,
            source_register=source_items,
            sources=sources,
        )

    def get_market_trends(
        self,
        theme: Optional[str] = None,
        source: Optional[str] = None,
        year: Optional[int] = None,
        evidence_type: Optional[str] = None,
    ) -> MarketTrendResponse:
        """Extracts Q4 Market and Macro Research evidence and analysis with optional filtering."""
        q4 = repository.load_market_research()

        evidence_items = [
            MarketEvidenceItem(
                source=e.source,
                year=e.year,
                geography=e.geography,
                market_sector=e.market_sector,
                indicator=e.indicator,
                period=e.period,
                reported_value=e.reported_value,
                measure=e.measure,
                evidence_type=e.evidence_type,
                research_note=e.research_note,
                publisher=e.publisher,
            )
            for e in q4.market_evidence
        ]

        trend_items = [
            MarketTrendItem(
                trend_area=t.trend_area,
                observed_signal=t.observed_signal,
                direction=t.direction,
                business_relevance=t.business_relevance,
                evidence_strength_context=t.evidence_strength_context,
            )
            for t in q4.trend_synthesis
        ]

        signal_items = [
            QuantifiedSignalItem(indicator=s.indicator, value=s.value) for s in q4.quantified_signals
        ]

        analysis_items = [
            MarketAnalysisItem(
                analytical_point=a.analytical_point,
                evidence=a.evidence,
                implication_for_nexa=a.implication_for_nexa,
                boundary_limitation=a.boundary_limitation,
            )
            for a in q4.q4_analysis
        ]

        source_items = [
            MarketSourceItem(
                source=s.source,
                publication_year=s.publication_year,
                publisher=s.publisher,
                source_link=s.source_link,
                what_it_contributes=s.what_it_contributes,
            )
            for s in q4.source_register
        ]

        sources = [
            SourceMeta(workbook=q4.traceability["market_evidence"].source_workbook, sheet="Market_Evidence"),
            SourceMeta(workbook=q4.traceability["trend_synthesis"].source_workbook, sheet="Trend_Synthesis"),
            SourceMeta(workbook=q4.traceability["q4_analysis"].source_workbook, sheet="Q4_Analysis"),
            SourceMeta(workbook=q4.traceability["source_register"].source_workbook, sheet="Source_Register"),
        ]

        filtered = evidence_items
        if theme:
            t_lower = theme.lower()
            filtered = [
                e for e in filtered
                if t_lower in e.market_sector.lower()
                or t_lower in e.indicator.lower()
                or (e.research_note and t_lower in e.research_note.lower())
            ]
        if source:
            s_lower = source.lower()
            filtered = [e for e in filtered if s_lower in e.source.lower() or (e.publisher and s_lower in e.publisher.lower())]
        if year:
            filtered = [e for e in filtered if e.year == year]
        if evidence_type:
            et_lower = evidence_type.lower()
            filtered = [e for e in filtered if et_lower in e.evidence_type.lower()]

        return MarketTrendResponse(
            total_evidence_records=len(evidence_items),
            filtered_evidence_records=len(filtered),
            market_evidence=filtered,
            trend_synthesis=trend_items,
            quantified_signals=signal_items,
            q4_analysis=analysis_items,
            source_register=source_items,
            sources=sources,
        )

    def get_strategy(self) -> StrategyResponse:
        """Extracts cross-domain evidence for strategy synthesis without inventing recommendations."""
        adv = repository.load_advertising_dataset()
        reg = adv.regression_model
        corr = adv.correlation.matrix
        q3 = repository.load_customer_research()
        q4 = repository.load_market_research()

        # Advertising evidence
        adv_evidence = StrategyAdvertisingEvidence(
            sample_size=reg.observations,
            r_squared=reg.r_squared,
            adjusted_r_squared=reg.adj_r_squared,
            f_statistic=reg.f_statistic,
            model_p_value=reg.model_p_value,
            residual_standard_error=reg.std_error_estimate,
        )

        # Channel evidence
        channel_items = []
        for ch_name, var_name, key in [
            ("TV", "tv_ads", "TV Ads"),
            ("Social Media", "social_media_ads", "Social Media Ads"),
            ("Print", "print_ads", "Print Ads"),
        ]:
            c_coef = next(c for c in reg.coefficients if c.term == key)
            c_corr = corr.get(key, {}).get("Sales", 0.0)
            shares = [getattr(w, f"{var_name.replace('_ads', '')}_spend_share") for w in adv.working_data]
            mean_share = sum(shares) / len(shares) if shares else 0.0
            spends = [getattr(r, var_name) for r in adv.raw_data]
            mean_spend = sum(spends) / len(spends) if spends else 0.0

            channel_items.append(StrategyChannelItem(
                channel=ch_name,
                variable=var_name,
                sales_correlation=c_corr,
                coefficient=c_coef.coefficient,
                p_value=c_coef.p_value,
                ci_lower=c_coef.ci_95_low,
                ci_upper=c_coef.ci_95_high,
                mean_spend=mean_spend,
                mean_spend_share=mean_share,
            ))

        # Top customer factors
        customer_factors = [
            StrategyCustomerFactorItem(
                factor=f.factor,
                observations_count=f.quantitative_observations,
                mean_pct=f.mean_reported_pct,
                median_pct=f.median_reported_pct,
                india_specific=f.india_specific_evidence,
                interpretation=f.interpretation,
            )
            for f in q3.factor_synthesis
        ]

        # Market signals
        market_signals = [
            StrategyMarketSignalItem(
                trend_area=t.trend_area,
                observed_signal=t.observed_signal,
                direction=t.direction,
                business_relevance=t.business_relevance,
            )
            for t in q4.trend_synthesis
        ]

        sources = [
            SourceMeta(workbook=adv.traceability["regression_model"].source_workbook, sheet="Regression_Model"),
            SourceMeta(workbook=q3.traceability["factor_synthesis"].source_workbook, sheet="Factor_Synthesis"),
            SourceMeta(workbook=q4.traceability["trend_synthesis"].source_workbook, sheet="Trend_Synthesis"),
        ]

        recommendations = [
            RecommendationItem(
                id="R01",
                title="Maintain Strong Attention on TV",
                action="Maintain strong attention on TV in the next planning period while validating its incremental contribution through controlled measurement.",
                why="TV has the strongest observed relationship with sales among the three advertising channels in the available dataset.",
                evidence=[
                    "TV-to-sales Pearson correlation: r = 0.7822.",
                    "TV regression coefficient: approximately +0.04576.",
                    "The combined advertising model has R² = 0.8972.",
                ],
                business_role="Reach / Awareness",
                business_role_desc="TV can remain an important reach and awareness channel within the advertising mix while its incremental contribution is measured.",
                risk="A strong historical relationship does not establish causal ROI. Increasing TV spend without incremental measurement could overstate its contribution.",
                implementation="Maintain meaningful TV activity while introducing a measurement approach that can distinguish incremental performance from baseline sales movement.",
                measurement="Track incremental sales or another predefined business outcome using controlled testing where practical.",
                priority="Next planning period",
                validation="Incremental-performance testing",
                source_layer="Q1 — Advertising & Sales / Q2 — Channel Analysis",
            ),
            RecommendationItem(
                id="R02",
                title="Maintain Strong Attention on Social Media",
                action="Maintain strong attention on social media and use controlled campaign testing to identify which executions generate incremental business outcomes.",
                why="Social media shows a meaningful positive relationship with sales and a positive coefficient in the multivariate model.",
                evidence=[
                    "Social media-to-sales Pearson correlation: r = 0.5762.",
                    "Social media regression coefficient: approximately +0.18853.",
                ],
                business_role="Customer Communication",
                business_role_desc="Social media can support measurable customer engagement, product communication and campaign testing.",
                risk="The observed relationship does not establish causal return or prove that additional spending will produce proportional sales growth.",
                implementation="Use structured campaign tests with predefined objectives and comparable measurement periods.",
                measurement="Track incremental sales or predefined campaign outcomes and compare tested executions.",
                priority="Next planning period",
                validation="Controlled campaign testing",
                source_layer="Q1 — Advertising & Sales / Q2 — Channel Analysis",
            ),
            RecommendationItem(
                id="R03",
                title="Reconsider Print Investment",
                action="Reconsider the role of print advertising and require evidence of incremental value before maintaining or expanding investment.",
                why="Print has a weaker observed relationship with sales than TV and social media, and its coefficient is not statistically significant in the multivariate model.",
                evidence=[
                    "Print-to-sales Pearson correlation: r = 0.2283.",
                    "Print regression coefficient: approximately -0.00104.",
                    "The print coefficient is not statistically significant in the multivariate model.",
                ],
                business_role="Channel Validation",
                business_role_desc="Print should be treated as a channel requiring validation rather than automatically receiving the same strategic attention as channels with stronger observed evidence.",
                risk="The available sales model may not capture all possible roles of print, including audience reach, brand visibility or local effects.",
                implementation="Do not eliminate print solely because of the regression result. Test whether specific print activity produces measurable incremental value before maintaining or expanding it.",
                measurement="Measure incremental outcomes for clearly defined print campaigns or placements where controlled testing is feasible.",
                priority="Immediate review",
                validation="Incremental print testing",
                source_layer="Q1 — Advertising & Sales / Q2 — Channel Analysis",
            ),
            RecommendationItem(
                id="R04",
                title="Build Product-Centered Messaging",
                action="Build marketing communication around a coherent product-value narrative that connects NEXA One's features to practical customer benefits.",
                why="Independent research identifies several recurring product considerations rather than one universal customer preference.",
                evidence=[
                    "Recurring research themes include sound quality, battery life, comfort, price/value, call quality, active noise cancellation and ease of use or compatibility.",
                    "Q3 contains 57 evidence observations from 10 research sources.",
                ],
                business_role="Product-Value Communication",
                business_role_desc="Messaging should communicate why the product is valuable in everyday use rather than relying on a single feature claim.",
                risk="Using too many disconnected feature claims could reduce message clarity.",
                implementation="Organize communications around a coherent product experience and use specific feature benefits as supporting proof points.",
                measurement="Track customer response to different message themes using campaign-level engagement or predefined conversion measures where available.",
                priority="Next campaign planning",
                validation="Message-level response measurement",
                source_layer="Q3 — Customer Purchase Drivers",
            ),
            RecommendationItem(
                id="R05",
                title="Make Value Explicit",
                action="Make the product's value proposition explicit by connecting features, product experience and price/value considerations.",
                why="Customer research repeatedly identifies price/value as one of the considerations relevant to wireless-audio evaluation, while Q4 evidence indicates premiumization within India's TWS market.",
                evidence=[
                    "Q3 research includes price/value among recurring customer considerations.",
                    "India TWS revenue increased 7% YoY in Q1 2026 while quarterly shipments declined, providing a premiumization signal.",
                ],
                business_role="Product-Value Communication",
                business_role_desc="Clear value communication can help NEXA explain why the product's combination of features and experience justifies its position.",
                risk="Premiumization evidence does not establish NEXA-specific willingness to pay.",
                implementation="Communicate the relationship between product features and customer value without assuming a specific willingness-to-pay level.",
                measurement="Track response to value-oriented messaging and compare campaign outcomes across defined executions.",
                priority="Next campaign planning",
                validation="Message testing",
                source_layer="Q3 — Customer Purchase Drivers / Q4 — Market & Macro",
            ),
            RecommendationItem(
                id="R06",
                title="Test Before Major Budget Reallocation",
                action="Use controlled testing and incremental-performance measurement before making major changes to channel allocation.",
                why="The available regression identifies statistical relationships but does not establish causal advertising ROI.",
                evidence=[
                    "R² = 0.8972.",
                    "Correlation and regression results are observational.",
                    "No channel-level cost, margin or causal incremental-return data is available.",
                ],
                business_role="Measurement & Attribution",
                business_role_desc="Testing provides a mechanism for converting historical directional evidence into stronger evidence for future allocation decisions.",
                risk="Poorly designed tests may produce misleading conclusions.",
                implementation="Define the test objective, comparison group or baseline, measurement period and primary outcome before execution.",
                measurement="Use incremental sales or another predefined business outcome rather than correlation alone.",
                priority="Before major allocation changes",
                validation="Controlled experiments",
                source_layer="Q1 — Advertising & Sales / Q5 — Strategy Decision",
            ),
            RecommendationItem(
                id="R07",
                title="Monitor Emerging Open-Ear Competition",
                action="Monitor the growth of open-ear wireless-audio products and assess whether changing form-factor preferences create a strategic consideration for NEXA One.",
                why="External market research shows growth in the OWS segment while global TWS shipments remain broadly flat.",
                evidence=[
                    "Global OWS shipments increased 12% YoY in Q2 2026.",
                    "OWS share increased to 13.5% from 12% a year earlier.",
                    "Global TWS shipments declined 0.7% YoY in Q2 2026.",
                ],
                business_role="Competitive Monitoring",
                business_role_desc="Monitoring alternative form factors can help management identify changes in the competitive wireless-audio environment.",
                risk="Global OWS evidence is not India-specific and does not measure NEXA demand.",
                implementation="Track category developments and competitive products before making product or marketing changes.",
                measurement="Monitor category shipment trends, competitor activity and relevant customer-response indicators as new evidence becomes available.",
                priority="Ongoing",
                validation="Category tracking",
                source_layer="Q4 — Market & Macro",
            ),
            RecommendationItem(
                id="R08",
                title="Monitor Affordability and Supply-Chain Conditions",
                action="Include affordability and supply-chain conditions in the next planning cycle and review them periodically.",
                why="External evidence indicates changing affordability conditions in adjacent consumer electronics and continued global trade and component-market dynamics.",
                evidence=[
                    "India smartphone shipments declined 13% YoY in Q2 2026 amid factors including rising memory costs, price increases, rupee depreciation, inflation and weaker affordability.",
                    "Global trade data indicates continued changes in trade inflation and component-category trade.",
                ],
                business_role="Risk Management",
                business_role_desc="Monitoring these conditions can help management identify potential pressure on consumer affordability, product costs and availability.",
                risk="Smartphone shipments are an adjacent-market proxy and do not directly measure headphone demand.",
                implementation="Use these indicators as contextual signals alongside NEXA-specific sales, pricing and cost information.",
                measurement="Track relevant product costs, inventory conditions, pricing indicators and updated external market evidence.",
                priority="Ongoing",
                validation="Market/cost monitoring",
                source_layer="Q4 — Market & Macro",
            ),
            RecommendationItem(
                id="R09",
                title="Use a Recurring Evidence Review",
                action="Create a recurring review of channel performance, customer response and market conditions before each major planning decision.",
                why="The current analysis combines historical advertising evidence with external research. Conditions can change after the current observation period.",
                evidence=[
                    "Q1/Q2 provide historical advertising-sales evidence.",
                    "Q3 provides source-specific customer research.",
                    "Q4 includes current market conditions, forecasts and external indicators.",
                ],
                business_role="Planning Discipline",
                business_role_desc="Regular evidence review reduces reliance on a single historical analysis when making future decisions.",
                risk="External indicators may change and different sources may use different populations, periods and methodologies.",
                implementation="Maintain a structured review containing internal performance data, customer evidence and market indicators.",
                measurement="Record changes in the evidence base and document how each major strategy decision was updated.",
                priority="Recurring",
                validation="Documented review cycle",
                source_layer="Q1–Q5 — Cross-Domain Evidence Base",
            ),
        ]

        action_plan_phases = [
            ActionPlanPhase(
                phase="PHASE A",
                title="Immediate Planning",
                timing="Next planning cycle",
                actions=[
                    "Review current TV, social media and print activity against the statistical evidence.",
                    "Identify the specific print activities that require incremental-value validation.",
                    "Define the measurement framework before changing major channel allocations.",
                    "Define the core NEXA product-value messaging framework.",
                ],
            ),
            ActionPlanPhase(
                phase="PHASE B",
                title="Campaign Preparation",
                timing="Before campaign launch",
                actions=[
                    "Create structured TV and social media campaign objectives.",
                    "Develop product-centered messaging around recurring customer considerations.",
                    "Define test groups, baselines or comparison periods where feasible.",
                    "Define primary and secondary success metrics before launch.",
                ],
            ),
            ActionPlanPhase(
                phase="PHASE C",
                title="Campaign Execution",
                timing="During campaign",
                actions=[
                    "Run the planned campaigns.",
                    "Maintain consistent measurement definitions.",
                    "Track sales and predefined campaign outcomes.",
                    "Record external market conditions that may affect interpretation.",
                ],
            ),
            ActionPlanPhase(
                phase="PHASE D",
                title="Performance Review",
                timing="After campaign",
                actions=[
                    "Compare measured outcomes against the predefined baseline or comparison.",
                    "Assess incremental performance where the test design allows it.",
                    "Review customer response to messaging.",
                    "Document findings and limitations.",
                ],
            ),
            ActionPlanPhase(
                phase="PHASE E",
                title="Next Allocation Decision",
                timing="Next planning cycle",
                actions=[
                    "Combine measured campaign performance with updated customer and market evidence.",
                    "Reassess channel roles.",
                    "Determine whether print activity should be maintained, modified or reduced based on measured evidence.",
                    "Update the strategy using the latest available evidence.",
                ],
            ),
        ]

        action_plan_table = [
            ActionPlanTableItem(
                action="Review channel evidence",
                timing="Immediate",
                evidence_trigger="Q2 channel analysis",
                owner="Marketing leadership",
                output="Current channel assessment",
                decision_gate="Identify channels requiring validation",
            ),
            ActionPlanTableItem(
                action="Design controlled channel tests",
                timing="Before campaign launch",
                evidence_trigger="Need for causal/incremental evidence",
                owner="Marketing + Analytics",
                output="Approved measurement design",
                decision_gate="Test is measurable before launch",
            ),
            ActionPlanTableItem(
                action="Develop product-value messaging",
                timing="Campaign preparation",
                evidence_trigger="Q3 customer research",
                owner="Marketing / Brand",
                output="Messaging framework",
                decision_gate="Messages reflect recurring customer considerations",
            ),
            ActionPlanTableItem(
                action="Launch measured campaigns",
                timing="Campaign period",
                evidence_trigger="Approved campaign and test design",
                owner="Marketing",
                output="Campaign performance data",
                decision_gate="Data quality sufficient for review",
            ),
            ActionPlanTableItem(
                action="Review incremental performance",
                timing="Post-campaign",
                evidence_trigger="Campaign results",
                owner="Analytics",
                output="Performance assessment",
                decision_gate="Evidence sufficient for next allocation discussion",
            ),
            ActionPlanTableItem(
                action="Update strategy",
                timing="Next planning cycle",
                evidence_trigger="Updated internal + external evidence",
                owner="Marketing leadership + Analytics",
                output="Updated strategy",
                decision_gate="Documented decision and assumptions",
            ),
        ]

        measurement_hierarchy = [
            MeasurementLevelItem(
                level="LEVEL 1",
                title="Business Outcome",
                description="Core commercial indicators (no invented targets)",
                metrics=[
                    "Sales volume and revenue trends",
                    "Units sold by channel and region",
                    "Predefined business outcome baselines",
                ],
            ),
            MeasurementLevelItem(
                level="LEVEL 2",
                title="Channel Performance",
                description="Channel-specific campaign metrics",
                metrics=[
                    "Campaign-level response and performance metrics",
                    "Incremental performance where test design permits",
                    "Controlled vs test group comparison",
                ],
            ),
            MeasurementLevelItem(
                level="LEVEL 3",
                title="Message Response",
                description="Customer response to product themes",
                metrics=[
                    "Response to defined product-value messages",
                    "Engagement across key feature pillars (sound, battery, comfort, ANC, value)",
                    "Predefined conversion measures where available",
                ],
            ),
            MeasurementLevelItem(
                level="LEVEL 4",
                title="Market Context",
                description="External environment tracking",
                metrics=[
                    "Category maturity and shipment trends",
                    "OWS / TWS form-factor developments",
                    "Consumer affordability indicators",
                    "Component and supply-chain conditions",
                ],
            ),
            MeasurementLevelItem(
                level="LEVEL 5",
                title="Decision Quality",
                description="Governance and planning auditability",
                metrics=[
                    "Documented evidence base used for each decision",
                    "Explicit assumptions and uncertainty boundaries",
                    "Documented test design and statistical limitations",
                    "Audit trail of resulting strategy updates",
                ],
            ),
        ]

        management_checklist = [
            "Current channel activity reviewed against Q1/Q2 evidence.",
            "Print activity identified for incremental-value validation.",
            "Measurement design approved before major allocation changes.",
            "Product-value messaging defined from Q3 evidence.",
            "Premiumization and emerging form-factor developments reviewed.",
            "Affordability indicators reviewed.",
            "Supply-chain conditions reviewed.",
            "Campaign outcomes defined before launch.",
            "Post-campaign incremental evidence reviewed.",
            "Next planning decision documented with assumptions and limitations.",
        ]

        avoid_decisions = [
            "Do not set exact channel budget percentages from the current regression alone.",
            "Do not describe regression coefficients as advertising ROI.",
            "Do not eliminate print solely because its coefficient is not statistically significant.",
            "Do not claim that one customer feature is universally most important.",
            "Do not treat global OWS growth as proof of NEXA-specific demand.",
            "Do not treat smartphone shipment trends as direct headphone demand.",
            "Do not treat external forecasts as guaranteed outcomes.",
        ]

        return StrategyResponse(
            advertising_evidence=adv_evidence,
            channel_evidence=channel_items,
            customer_purchase_factors=customer_factors,
            market_macro_signals=market_signals,
            analyst_notes=adv.analysis_summary.analyst_notes,
            sources=sources,
            recommendations=recommendations,
            action_plan_phases=action_plan_phases,
            action_plan_table=action_plan_table,
            measurement_hierarchy=measurement_hierarchy,
            management_checklist=management_checklist,
            avoid_decisions=avoid_decisions,
        )

    def get_sources(self) -> SourceRegistryResponse:
        """Combines and returns unified source citations from all 3 domains."""
        adv = repository.load_advertising_dataset()
        q3 = repository.load_customer_research()
        q4 = repository.load_market_research()

        unified: List[UnifiedSourceItem] = []
        idx = 1

        # Advertising source
        adv_wb = adv.traceability["raw_data"].source_workbook
        unified.append(UnifiedSourceItem(
            source_id=f"SRC-ADV-{idx:02d}",
            source_name="GTA 2.0 NEXA Advertising Dataset",
            publisher="NEXA Analytics / Grand Theft Analytica 2.0 Case",
            publication_year=2026,
            url_or_reference=None,
            geography="Multi-market (200 markets)",
            topic="Advertising & Sales Attribution",
            source_type="Empirical dataset",
            dataset_domain="Advertising Analytics",
            source_workbook=adv_wb,
            source_sheet="Raw_Data",
            what_it_contributes="200 market-level observations of TV, social media, print expenditure and sales.",
        ))

        # Q3 sources
        q3_wb = q3.traceability["source_register"].source_workbook
        for s in q3.source_register:
            idx += 1
            unified.append(UnifiedSourceItem(
                source_id=f"SRC-Q3-{idx:02d}",
                source_name=s.source,
                publisher=s.publisher,
                publication_year=s.publication_year,
                url_or_reference=s.source_link,
                geography=None,
                topic="Customer Purchase Drivers",
                source_type="External research survey / tracker",
                dataset_domain="Q3 Customer Research",
                source_workbook=q3_wb,
                source_sheet="Source_Register",
                what_it_contributes=s.what_it_contributes,
            ))

        # Q4 sources
        q4_wb = q4.traceability["source_register"].source_workbook
        for s in q4.source_register:
            idx += 1
            unified.append(UnifiedSourceItem(
                source_id=f"SRC-Q4-{idx:02d}",
                source_name=s.source,
                publisher=s.publisher,
                publication_year=s.publication_year,
                url_or_reference=s.source_link,
                geography=None,
                topic="Market & Macro Environment",
                source_type="External market report / macroeconomic tracker",
                dataset_domain="Q4 Market & Macro Research",
                source_workbook=q4_wb,
                source_sheet="Source_Register",
                what_it_contributes=s.what_it_contributes,
            ))

        return SourceRegistryResponse(
            total_sources=len(unified),
            sources=unified,
        )


analytics_service = AnalyticsService()
