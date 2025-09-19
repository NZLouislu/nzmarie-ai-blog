-- NZMarie Initial Blog Data for Supabase PostgreSQL
-- This script creates initial blog posts and related data for nzmarie user

-- First, ensure nzmarie user exists in the database
INSERT INTO users (id, email, name, role, "languagePreferences", "createdAt", "updatedAt")
VALUES ('nzmarie', 'marie@nzrealestate.co.nz', 'Marie Thompson - Licensed Real Estate Agent', 'user', 'both', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert initial blog posts for nzmarie (English)
INSERT INTO posts (id, "authorId", slug, title, content, language, status, "publishedAt", "coverImage", tags, "createdAt", "updatedAt")
VALUES 
('marie-post-1-en', 'nzmarie', 'buying-property-new-zealand-complete-guide', 
'Your Complete Guide to Buying Property in New Zealand', 
'# Your Complete Guide to Buying Property in New Zealand

Welcome! I''m Marie Thompson, a licensed real estate agent with over 8 years of experience helping clients navigate New Zealand''s property market. Whether you''re a first-time buyer or looking to invest, this comprehensive guide will walk you through every step of the property buying process.

## Understanding the New Zealand Property Market

New Zealand''s property market is unique, with regional variations and specific regulations that buyers need to understand:

### Key Market Features
- **Overseas Investment Rules**: Non-residents face restrictions on purchasing existing residential property
- **Regional Variations**: Auckland, Wellington, and Christchurch have different market dynamics
- **Seasonal Trends**: Spring (September-November) is traditionally the busiest selling season

## Step-by-Step Buying Process

### 1. Get Pre-Approved for Finance
Before you start house hunting, secure pre-approval from a bank or mortgage broker:
- **Income Assessment**: Provide 3 months of payslips and bank statements
- **Deposit Requirements**: Typically 20% for existing properties, 10% for new builds
- **Credit Check**: Ensure your credit history is clean

### 2. Determine Your Budget
Consider all costs involved:
- **Purchase Price**: The agreed sale price
- **Legal Fees**: $1,500-$3,000 for conveyancing
- **Building Inspection**: $600-$1,200 for professional reports
- **LIM Report**: $300-$500 from local council
- **Insurance**: Arrange before settlement

### 3. Choose the Right Location
Research thoroughly:
- **School Zones**: Check if properties are in desired school catchments
- **Transport Links**: Consider commute times and public transport
- **Future Development**: Research council plans for the area
- **Amenities**: Proximity to shops, parks, and healthcare

### 4. Start Your Property Search
Work with a licensed real estate agent who:
- Understands your needs and budget
- Has local market knowledge
- Can arrange viewings and provide market insights
- Will negotiate on your behalf

### 5. Making an Offer
In New Zealand, you can make offers:
- **By Negotiation**: Direct negotiation with the vendor
- **By Tender**: Submit sealed bids by a specified date
- **By Auction**: Bid publicly on auction day

### 6. Due Diligence Period
Once your offer is accepted, you typically have 10-15 working days for:
- **Building Inspection**: Identify any structural issues
- **LIM Report Review**: Check council records for the property
- **Finance Confirmation**: Finalize your mortgage approval
- **Insurance Arrangement**: Secure building and contents insurance

### 7. Settlement Process
Your lawyer will handle:
- **Title Transfer**: Ensuring clear title transfer
- **Settlement Date**: Usually 4-6 weeks after agreement
- **Final Inspections**: Check property condition before settlement
- **Key Handover**: Receive keys and possession

## Tips for Success

### For First-Time Buyers
- **KiwiSaver HomeStart Grant**: You may be eligible for up to $10,000
- **First Home Loan**: Consider government-backed lending schemes
- **Budget Realistically**: Include ongoing costs like rates, insurance, and maintenance

### For Investors
- **Rental Yield**: Calculate potential rental return
- **Capital Growth**: Research area growth potential
- **Tax Implications**: Understand bright-line test and deductibility rules
- **Property Management**: Factor in management costs if using an agent

## Common Pitfalls to Avoid

1. **Skipping Inspections**: Always get professional building and pest inspections
2. **Emotional Bidding**: Set a maximum price and stick to it
3. **Ignoring Body Corporate**: For apartments, review body corporate rules and fees
4. **Rushing Decisions**: Take time to research and consider all factors

## Current Market Insights

As of 2024, key trends include:
- **Interest Rate Sensitivity**: Monitor RBNZ decisions affecting mortgage rates
- **Supply Constraints**: Limited housing stock in major centers
- **Government Policies**: Stay updated on housing-related policy changes
- **Regional Growth**: Smaller centers showing strong growth potential

## Working with Marie Thompson Real Estate

With my Real Estate Institute of New Zealand (REINZ) license and local expertise, I provide:
- **Market Analysis**: Detailed comparable sales data
- **Negotiation Expertise**: Achieving the best possible price
- **Professional Network**: Connections with lawyers, builders, and mortgage brokers
- **Ongoing Support**: Guidance throughout the entire process

## Next Steps

Ready to start your property journey? Contact me for a no-obligation consultation where we''ll discuss:
- Your specific needs and budget
- Current market opportunities
- A tailored buying strategy
- Timeline and next steps

Remember, buying property is one of life''s biggest investments. Having the right guidance makes all the difference in achieving your property goals.

**Contact Marie Thompson**  
Licensed Real Estate Agent (REAA 2008)  
📧 marie@nzrealestate.co.nz  
📱 021 555 0123  
🏢 Harcourts Auckland Central

*Disclaimer: This information is general in nature and should not replace professional financial or legal advice.*', 
'en', 'published', NOW(), NULL, 'real-estate,property-buying,new-zealand,first-home-buyer,investment', NOW(), NOW()),

('marie-post-2-en', 'nzmarie', 'selling-your-home-new-zealand-step-by-step', 
'Selling Your Home in New Zealand: A Step-by-Step Guide for Homeowners', 
'# Selling Your Home in New Zealand: A Step-by-Step Guide for Homeowners

Thinking about selling your home? As a licensed real estate agent with extensive experience in the New Zealand market, I''ve helped hundreds of homeowners successfully sell their properties. This comprehensive guide will walk you through every step of the selling process to help you achieve the best possible outcome.

## Before You Start: Key Considerations

### Timing Your Sale
- **Market Conditions**: Spring (September-November) typically sees higher buyer activity
- **Personal Circumstances**: Ensure you have your next move planned
- **Financial Position**: Understand your mortgage obligations and potential capital gains

### Setting Realistic Expectations
- **Market Value**: Get a professional appraisal to understand your property''s worth
- **Selling Costs**: Budget for marketing, legal fees, and agent commission
- **Timeframe**: Average selling time varies by location and market conditions

## Step 1: Prepare Your Property

### Essential Repairs and Maintenance
Before listing, address:
- **Structural Issues**: Fix any obvious defects that could deter buyers
- **Plumbing and Electrical**: Ensure all systems are working properly
- **Roof and Gutters**: Check for leaks and clean gutters
- **Painting**: Fresh paint can significantly improve presentation

### Staging and Presentation
- **Declutter**: Remove personal items and excess furniture
- **Deep Clean**: Professional cleaning makes a huge difference
- **Curb Appeal**: Maintain gardens and exterior appearance
- **Lighting**: Ensure all rooms are well-lit for viewings

### Documentation Preparation
Gather important documents:
- **Title Documents**: Certificate of title and any easements
- **Building Consent**: Records of any alterations or additions
- **Code Compliance Certificates**: For any building work
- **Rates Information**: Current rates assessment
- **Insurance Details**: Building insurance information

## Step 2: Choose Your Selling Method

### Auction
**Pros:**
- Creates competitive bidding environment
- Sets definite sale date
- Transparent process

**Cons:**
- Property may not reach reserve
- Higher marketing costs
- Stressful for some vendors

### Tender
**Pros:**
- Allows buyers time to consider offers
- Can achieve premium prices
- Flexible settlement terms

**Cons:**
- No guarantee of sale
- Longer process
- May receive lower offers

### By Negotiation
**Pros:**
- Flexible pricing strategy
- Can negotiate terms
- Less pressure than auction

**Cons:**
- May take longer to sell
- Requires skilled negotiation
- Price expectations may not be met

## Step 3: Marketing Your Property

### Professional Photography
- **High-Quality Images**: Essential for online listings
- **Drone Photography**: Showcases property and surroundings
- **Virtual Tours**: Increasingly popular with buyers

### Online Presence
- **TradeMe Property**: New Zealand''s largest property portal
- **Realestate.co.nz**: REINZ''s official website
- **Social Media**: Facebook and Instagram marketing
- **Agent''s Website**: Professional presentation

### Traditional Marketing
- **Print Advertising**: Local newspapers and magazines
- **Signage**: Professional "For Sale" signs
- **Brochures**: High-quality marketing materials
- **Open Homes**: Regular viewing opportunities

## Step 4: Legal Requirements

### LIM Report
- **Land Information Memorandum**: Provides council information about your property
- **Cost**: $300-$500 from local council
- **Contents**: Building consents, rates, zoning information

### Property Disclosure
You must disclose:
- **Known Defects**: Any structural or other significant issues
- **Alterations**: Building work done without consent
- **Disputes**: Any neighbor or boundary disputes
- **Insurance Claims**: Previous insurance claims on the property

## Step 5: Managing Viewings and Offers

### Open Homes
- **Preparation**: Ensure property is clean and well-presented
- **Safety**: Remove valuables and personal documents
- **Feedback**: Collect buyer feedback to improve presentation

### Private Viewings
- **Flexibility**: Accommodate serious buyers'' schedules
- **Security**: Always accompany viewers or use your agent
- **Follow-up**: Maintain contact with interested parties

### Evaluating Offers
Consider:
- **Price**: Not just the highest offer, but the most suitable
- **Conditions**: Finance, building inspection, settlement date
- **Buyer Position**: Pre-approved finance and deposit amount

## Step 6: The Sale Process

### Accepting an Offer
- **Negotiation**: Your agent will negotiate terms on your behalf
- **Conditions**: Agree on settlement date and any conditions
- **Deposit**: Typically 10% paid to lawyer''s trust account

### Due Diligence Period
Buyers typically have 10-15 working days for:
- **Building Inspection**: Professional property assessment
- **Finance Approval**: Final mortgage confirmation
- **LIM Review**: Checking council information
- **Legal Review**: Lawyer examining all documents

### Settlement
- **Final Inspection**: Buyer checks property condition
- **Document Signing**: Transfer of ownership documents
- **Key Handover**: Usually on settlement day
- **Moving Out**: Ensure property is clean and empty

## Costs of Selling

### Agent Commission
- **Typical Range**: 2.5% - 4% + GST of sale price
- **Negotiable**: Discuss commission structure with your agent
- **Marketing Costs**: May be additional to commission

### Legal Fees
- **Conveyancing**: $1,500 - $2,500 for standard sales
- **Complex Sales**: Higher fees for complicated transactions

### Other Costs
- **Marketing**: $2,000 - $8,000 depending on campaign
- **Staging**: $1,000 - $5,000 if using professional staging
- **Repairs**: Budget for any necessary maintenance

## Maximizing Your Sale Price

### Presentation Tips
- **Neutral Décor**: Appeal to the widest range of buyers
- **Fresh Flowers**: Add warmth and fragrance
- **Baking Smells**: Create a homely atmosphere during viewings
- **Temperature**: Ensure comfortable temperature year-round

### Timing Strategies
- **Market Research**: Understand local market conditions
- **Seasonal Factors**: Consider best time to list in your area
- **Competition**: Be aware of similar properties for sale

## Common Mistakes to Avoid

1. **Overpricing**: Setting unrealistic price expectations
2. **Poor Presentation**: Not investing in property preparation
3. **Limited Marketing**: Insufficient exposure to buyers
4. **Emotional Decisions**: Not accepting reasonable offers
5. **Inadequate Documentation**: Missing important certificates or consents

## Working with Marie Thompson Real Estate

As your licensed real estate agent, I provide:

### Comprehensive Service
- **Market Appraisal**: Accurate pricing based on recent sales
- **Marketing Strategy**: Tailored campaign for your property
- **Professional Photography**: High-quality images and virtual tours
- **Negotiation Expertise**: Achieving the best possible price

### Local Expertise
- **Market Knowledge**: Deep understanding of local conditions
- **Buyer Network**: Access to qualified buyers
- **Professional Contacts**: Lawyers, builders, and other specialists
- **Ongoing Support**: Guidance throughout the entire process

## Ready to Sell?

If you''re considering selling your home, I''d love to help you achieve the best possible outcome. Contact me for a complimentary, no-obligation market appraisal where we''ll discuss:

- Current market value of your property
- Optimal selling strategy for your situation
- Marketing recommendations
- Expected timeframe and costs
- Next steps in the process

**Contact Marie Thompson**  
Licensed Real Estate Agent (REAA 2008)  
📧 marie@nzrealestate.co.nz  
📱 021 555 0123  
🏢 Harcourts Auckland Central

**Recent Success Stories:**
- Average of 95% of CV achieved for clients in 2024
- Average time on market: 28 days
- 98% client satisfaction rating

*Disclaimer: This information is general in nature. Property values and market conditions vary by location and time. Always seek professional advice for your specific situation.*', 
'en', 'published', NOW(), NULL, 'real-estate,property-selling,new-zealand,home-selling,real-estate-agent', NOW(), NOW()),

('marie-post-2-en', 'nzmarie', 'selling-property-new-zealand-complete-guide', 
'Your Complete Guide to Selling Property in New Zealand', 
'# Your Complete Guide to Selling Property in New Zealand

Welcome! I''m Marie Thompson, your trusted licensed real estate agent with over 8 years of experience in New Zealand''s dynamic property market. Selling your home is one of life''s biggest decisions, and I''m here to guide you through every step to ensure you achieve the best possible outcome.

## Understanding the Current Market

New Zealand''s property market continues to evolve, and understanding current conditions is crucial for a successful sale:

### Market Trends 2024
- **Buyer Behavior**: More selective buyers taking time to decide
- **Interest Rates**: Current rates affecting buyer purchasing power  
- **Inventory Levels**: Balanced market in most regions
- **Seasonal Patterns**: Spring remains the prime selling season

## Step 1: Preparing Your Property

### Essential Repairs and Maintenance
Before listing, address:
- **Structural Issues**: Fix any obvious problems
- **Fresh Paint**: Neutral colors appeal to more buyers
- **Garden Maintenance**: First impressions matter
- **Deep Cleaning**: Professional cleaning recommended

### Staging Your Home
- **Declutter**: Remove personal items and excess furniture
- **Neutral Décor**: Appeal to the widest range of buyers
- **Fresh Flowers**: Add warmth and fragrance
- **Baking Smells**: Create a homely atmosphere during viewings
- **Temperature**: Ensure comfortable temperature year-round

### Timing Strategies
- **Market Research**: Understand local market conditions
- **Seasonal Factors**: Consider best time to list in your area
- **Competition**: Be aware of similar properties for sale

## Common Mistakes to Avoid

1. **Overpricing**: Setting unrealistic price expectations
2. **Poor Presentation**: Not investing in property preparation
3. **Limited Marketing**: Insufficient exposure to buyers
4. **Emotional Decisions**: Not accepting reasonable offers
5. **Inadequate Documentation**: Missing important certificates or consents

## Working with Marie Thompson Real Estate

As your licensed real estate agent, I provide:

### Comprehensive Service
- **Market Appraisal**: Accurate pricing based on recent sales
- **Marketing Strategy**: Tailored campaign for your property
- **Professional Photography**: High-quality images and virtual tours
- **Negotiation Expertise**: Achieving the best possible price

### Local Expertise
- **Market Knowledge**: Deep understanding of local conditions
- **Buyer Network**: Access to qualified buyers
- **Professional Contacts**: Lawyers, builders, and other specialists
- **Ongoing Support**: Guidance throughout the entire process

## Ready to Sell?

If you''re considering selling your home, I''d love to help you achieve the best possible outcome. Contact me for a complimentary, no-obligation market appraisal where we''ll discuss:

- Current market value of your property
- Optimal selling strategy for your situation
- Marketing recommendations
- Expected timeframe and costs
- Next steps in the process

**Contact Marie Thompson**  
Licensed Real Estate Agent (REAA 2008)  
📧 marie@nzrealestate.co.nz  
📱 021 555 0123  
🏢 Harcourts Auckland Central

**Recent Success Stories:**
- Average of 95% of CV achieved for clients in 2024
- Average time on market: 28 days
- 98% client satisfaction rating

*Disclaimer: This information is general in nature. Property values and market conditions vary by location and time. Always seek professional advice for your specific situation.*', 
'en', 'published', NOW(), NULL, 'real-estate,property-selling,new-zealand,home-selling,real-estate-agent', NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- Insert initial blog posts for nzmarie (Chinese)
INSERT INTO posts (id, "authorId", slug, title, content, language, status, "publishedAt", "coverImage", tags, "createdAt", "updatedAt")
VALUES 
('marie-post-1-zh', 'nzmarie', 'marie-buying-property-nz-chinese-guide', 
'在新西兰购房完整指南', 
'# 在新西兰购房完整指南

您好！我是Marie Thompson，持有新西兰房地产执照的专业房地产经纪人，拥有8年以上帮助客户在新西兰房地产市场成功置业的经验。无论您是首次购房者还是投资者，这份全面指南将为您详细介绍新西兰购房的每个步骤。

## 了解新西兰房地产市场

新西兰的房地产市场具有独特性，有地区差异和特定法规需要购房者了解：

### 主要市场特征
- **海外投资规定**：非居民购买现有住宅物业面临限制
- **地区差异**：奥克兰、惠灵顿和基督城有不同的市场动态
- **季节性趋势**：春季（9-11月）传统上是最繁忙的销售季节

## 购房步骤详解

### 第一步：获得贷款预批
在开始看房之前，先从银行或贷款经纪人处获得预批：
- **收入评估**：提供3个月的工资单和银行对账单
- **首付要求**：现有房产通常需20%，新建房产需10%
- **信用检查**：确保您的信用记录良好

### 第二步：确定预算
考虑所有相关费用：
- **购买价格**：协议销售价格
- **法律费用**：产权转让费用$1,500-$3,000
- **房屋检查**：专业报告费用$600-$1,200
- **LIM报告**：市政府信息报告$300-$500
- **保险**：在交割前安排

### 第三步：选择合适的地点
深入研究：
- **学区**：检查房产是否在理想的学校学区内
- **交通连接**：考虑通勤时间和公共交通
- **未来发展**：研究市政府对该地区的规划
- **便民设施**：商店、公园和医疗设施的便利性

### 第四步：开始房产搜索
与持牌房地产经纪人合作：
- 了解您的需求和预算
- 具有当地市场知识
- 可以安排看房并提供市场见解
- 代表您进行谈判

### 第五步：出价
在新西兰，您可以通过以下方式出价：
- **协商出价**：与卖方直接协商
- **投标**：在指定日期前提交密封投标
- **拍卖**：在拍卖日公开竞价

### 第六步：尽职调查期
一旦您的出价被接受，通常有10-15个工作日用于：
- **房屋检查**：识别任何结构问题
- **LIM报告审查**：检查房产的市政府记录
- **贷款确认**：最终确定抵押贷款批准
- **保险安排**：确保建筑和财产保险

### 第七步：交割过程
您的律师将处理：
- **产权转让**：确保清晰的产权转移
- **交割日期**：通常在协议后4-6周
- **最终检查**：交割前检查房产状况
- **钥匙交接**：接收钥匙和房产所有权

## 成功购房贴士

### 首次购房者
- **KiwiSaver首次购房补助**：您可能有资格获得最高$10,000的补助
- **首次购房贷款**：考虑政府支持的贷款计划
- **现实预算**：包括持续费用如地税、保险和维护

### 投资者
- **租金收益率**：计算潜在租金回报
- **资本增长**：研究地区增长潜力
- **税务影响**：了解明线测试和可扣除性规则
- **物业管理**：如使用代理，考虑管理费用

## 常见陷阱避免

1. **跳过检查**：始终进行专业建筑和害虫检查
2. **情绪化出价**：设定最高价格并坚持
3. **忽视业主立案法团**：对于公寓，审查业主立案法团规则和费用
4. **匆忙决定**：花时间研究和考虑所有因素

## 当前市场洞察

截至2024年，主要趋势包括：
- **利率敏感性**：关注新西兰储备银行决定对抵押贷款利率的影响
- **供应限制**：主要中心的住房库存有限
- **政府政策**：及时了解住房相关政策变化
- **地区增长**：较小中心显示强劲增长潜力

## 与Marie Thompson房地产合作

凭借我的新西兰房地产协会(REINZ)执照和当地专业知识，我提供：
- **市场分析**：详细的可比销售数据
- **谈判专业知识**：争取最佳可能价格
- **专业网络**：与律师、建筑商和抵押贷款经纪人的联系
- **持续支持**：整个过程中的指导

## 下一步

准备开始您的房产之旅？联系我进行免费咨询，我们将讨论：
- 您的具体需求和预算
- 当前市场机会
- 量身定制的购买策略
- 时间表和下一步

记住，购买房产是人生最大的投资之一。拥有正确的指导对实现您的房产目标至关重要。

**联系Marie Thompson**  
持牌房地产经纪人 (REAA 2008)  
📧 marie@nzrealestate.co.nz  
📱 021 555 0123  
🏢 Harcourts奥克兰中央

*免责声明：此信息为一般性质，不应替代专业财务或法律建议。*', 
'zh', 'published', NOW(), NULL, '房地产,购房,新西兰,首次购房,投资', NOW(), NOW()),

('marie-post-2-zh', 'nzmarie', 'marie-selling-property-nz-chinese-guide', 
'在新西兰出售房产：房主分步指南', 
'# 在新西兰出售房产：房主分步指南

您好！我是Marie Thompson，持有新西兰房地产执照的专业房地产经纪人。如果您正在考虑出售您的房产，这份全面指南将帮助您了解整个过程，并最大化您的销售成功。

## 出售前的准备工作

### 市场评估
在将房产投放市场之前，了解其真实市场价值至关重要：
- **比较市场分析(CMA)**：查看最近3-6个月内类似房产的销售价格
- **专业评估**：考虑获得注册估价师的正式评估
- **市场趋势**：了解当前是买方市场还是卖方市场

### 房产准备
第一印象至关重要，投资一些改进可以显著提高售价：

#### 外观吸引力
- **园艺美化**：修剪草坪，种植鲜花，清理杂草
- **外墙清洁**：高压清洗房屋外墙和车道
- **入口区域**：确保前门和入口区域整洁迎人

#### 室内准备
- **深度清洁**：专业清洁地毯和窗户
- **去个人化**：移除个人照片和过多装饰品
- **小修小补**：修复漏水龙头、破损瓷砖、刮痕墙面
- **中性色彩**：考虑重新粉刷成中性色调

#### 房屋布置
- **整理空间**：移除多余家具，让房间看起来更宽敞
- **照明优化**：确保所有房间光线充足
- **温度舒适**：在看房时保持适宜的室内温度

## 选择销售方法

新西兰有几种常见的房产销售方式：

### 1. 拍卖销售
**优势：**
- 创造竞争环境
- 设定明确的销售日期
- 透明的销售过程

**适合情况：**
- 独特或高需求房产
- 强势市场条件
- 希望快速销售

### 2. 投标销售
**优势：**
- 吸引多个买家
- 保持价格竞争
- 灵活的时间安排

**适合情况：**
- 标准住宅房产
- 稳定市场条件
- 需要时间进行尽职调查

### 3. 协商销售
**优势：**
- 价格灵活性
- 私人协商过程
- 可以设定条件

**适合情况：**
- 特殊情况房产
- 买方市场
- 需要特定销售条件

## 法律要求和文件

### 必需文件
- **LIM报告**：土地信息备忘录（通常由买方获取）
- **建筑报告**：如果房产有已知问题
- **产权证书**：证明所有权
- **租约协议**：如果房产有租户

### 披露义务
作为卖方，您必须披露：
- 已知的结构问题
- 过去的洪水或地质问题
- 邻里纠纷
- 规划或分区变更

## 营销策略

### 专业摄影
- **高质量照片**：投资专业房产摄影
- **虚拟游览**：考虑360度虚拟游览
- **无人机航拍**：展示房产和周边环境

### 在线营销
- **Trade Me Property**：新西兰最大的房产网站
- **realestate.co.nz**：主要房地产门户网站
- **社交媒体**：Facebook和Instagram推广

### 传统营销
- **开放参观**：安排定期开放参观
- **标牌**：在房产前放置销售标牌
- **印刷广告**：当地报纸和房产杂志

## 谈判过程

### 评估出价
收到出价时考虑：
- **出价金额**：与您的期望价格比较
- **买方资格**：确认买方有融资预批
- **条件**：评估任何销售条件
- **交割时间**：考虑时间安排是否合适

### 反出价策略
- **价格调整**：如果出价低于期望
- **条件修改**：调整不利条件
- **时间协商**：调整交割日期

## 销售后流程

### 法律程序
一旦接受出价：
- **签署销售协议**：通过律师完成
- **尽职调查期**：买方进行检查和确认融资
- **交割准备**：准备移交房产

### 搬迁准备
- **搬家安排**：提前预订搬家公司
- **公用事业转移**：安排电力、燃气、水费转移
- **地址变更**：更新银行、保险等机构地址

## 税务考虑

### 明线测试
如果您在购买后10年内（某些情况下为5年）出售房产：
- **可能需要缴税**：销售利润可能需要缴纳所得税
- **例外情况**：主要住所通常免税
- **专业建议**：咨询会计师了解您的具体情况

### 资本利得
- **无一般资本利得税**：新西兰通常不对资本利得征税
- **例外情况**：房产交易或投机可能被征税

## 常见错误避免

1. **定价过高**：可能导致房产在市场上停留过久
2. **准备不足**：未充分准备房产展示
3. **情绪化决策**：让情感影响商业决策
4. **忽视法律建议**：未获得适当的法律和财务建议
5. **营销不足**：未充分推广房产

## 当前市场洞察

2024年新西兰房地产市场特点：
- **利率影响**：抵押贷款利率变化影响买方需求
- **库存水平**：某些地区房产供应紧张
- **季节性模式**：春季（9-11月）通常是最佳销售时机
- **地区差异**：不同地区有不同的市场动态

## 与Marie Thompson合作的优势

作为经验丰富的持牌房地产经纪人，我提供：
- **市场专业知识**：深入了解当地市场趋势
- **营销专长**：全面的房产推广策略
- **谈判技巧**：为您争取最佳销售价格
- **专业网络**：与律师、摄影师、营销专家的联系
- **全程支持**：从准备到交割的完整服务

## 开始您的销售之旅

准备出售您的房产？联系我安排免费市场评估，我们将讨论：
- 您房产的当前市场价值
- 最佳销售策略和时机
- 准备工作和改进建议
- 预期时间表和流程

记住，成功的房产销售需要适当的准备、正确的定价和有效的营销。让我帮助您实现最佳销售结果。

**联系Marie Thompson**  
持牌房地产经纪人 (REAA 2008)  
📧 marie@nzrealestate.co.nz  
📱 021 555 0123  
🏢 Harcourts奥克兰中央

**近期成功案例：**
- 2024年客户平均达到CV的95%
- 平均市场时间：28天
- 客户满意度：98%

*免责声明：此信息为一般性质。房产价值和市场条件因地点和时间而异。请始终为您的具体情况寻求专业建议。*', 
'zh', 'published', NOW(), NULL, '房地产,房产销售,新西兰,卖房,房地产经纪人', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert some sample comments for nzmarie's posts
INSERT INTO comments ("postId", "authorName", "authorEmail", content, status, "createdAt")
VALUES 
('marie-post-2-en', 'Michael Thompson', 'mthompson@outlook.com', 'Great step-by-step guide for selling. The marketing tips are spot on. Marie clearly knows the NZ market well.', 'approved', NOW() - INTERVAL '1 day'),
('marie-post-1-zh', '李明', 'liming@email.com', '非常详细的购房指南！作为新移民，这些信息对我很有帮助。谢谢Marie的专业建议。', 'approved', NOW() - INTERVAL '4 days'),
('marie-post-2-zh', '王小红', 'wang.xiaohong@gmail.com', '卖房指南写得很全面，特别是关于税务的部分很实用。期待更多房地产相关的文章。', 'approved', NOW() - INTERVAL '1 day'),
('marie-post-2-en', 'Jennifer Lee', 'jennifer.lee@email.com', 'As someone who just sold their Auckland home, I can confirm this guide is accurate. Marie helped us through the whole process!', 'approved', NOW() - INTERVAL '3 hours');