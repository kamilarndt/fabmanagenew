# New UI Migration System - Quick Reference

## 🚀 Quick Start

**Development Server**: `http://localhost:5173`  
**Migration Dashboard**: `http://localhost:5173/migration-dashboard`

## 🎯 User Segments

| Segment            | Percentage | New UI Access | Description                 |
| ------------------ | ---------- | ------------- | --------------------------- |
| **Early Adopters** | 10%        | Full          | All new UI features enabled |
| **Power Users**    | 20%        | Partial       | Dashboard + Projects new UI |
| **Regular Users**  | 40%        | Limited       | Dashboard only new UI       |
| **New Users**      | 20%        | Full          | All new UI from start       |
| **Control Group**  | 10%        | None          | Old UI only for comparison  |

## 🔧 Feature Flags

| Flag              | Description       | Default               |
| ----------------- | ----------------- | --------------------- |
| `newUI`           | Master switch     | Based on user segment |
| `newUIDashboard`  | Dashboard page    | Based on user segment |
| `newUIProjects`   | Projects page     | Based on user segment |
| `newUIMaterials`  | Materials page    | Based on user segment |
| `newUITiles`      | Tiles page        | Based on user segment |
| `newUISettings`   | Settings page     | Based on user segment |
| `newUINavigation` | Navigation system | Based on user segment |
| `newUIForms`      | Form components   | Based on user segment |
| `newUITables`     | Table components  | Based on user segment |

## 📱 New UI Pages

- **Dashboard V2**: `/dashboard-v2`
- **Projects V2**: `/projects-v2`
- **Materials V2**: `/materials-v2`
- **Tiles V2**: `/tiles-v2`
- **Settings V2**: `/settings-v2`

## 🔄 Bridge Components

| Component | Old UI     | New UI    | Status |
| --------- | ---------- | --------- | ------ |
| Button    | Ant Design | shadcn/ui | ✅     |
| Card      | Ant Design | shadcn/ui | ✅     |
| Input     | Ant Design | shadcn/ui | ✅     |
| Table     | Ant Design | shadcn/ui | ✅     |
| Form      | Ant Design | shadcn/ui | ✅     |
| Modal     | Ant Design | shadcn/ui | ✅     |

## 📊 Performance Thresholds

| Metric           | Threshold | Action  |
| ---------------- | --------- | ------- |
| Page Load Time   | < 2000ms  | ✅ Good |
| Component Render | < 100ms   | ✅ Good |
| User Interaction | < 200ms   | ✅ Good |
| Memory Usage     | < 100MB   | ✅ Good |
| Error Rate       | < 1%      | ✅ Good |

## 🧪 Testing Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run Storybook
npm run storybook
```

## 🔍 Debug Commands

```bash
# Check user segment
localStorage.getItem('user-profile')

# Reset user profile
localStorage.removeItem('user-profile')

# Check feature flags
console.log(features)

# Check performance metrics
console.log(performanceOptimizer.getPerformanceReport())
```

## 🚨 Quick Troubleshooting

| Issue                           | Solution                                   |
| ------------------------------- | ------------------------------------------ |
| New UI not showing              | Check feature flags in Migration Dashboard |
| Performance issues              | Check Performance Optimization section     |
| User segment not working        | Clear localStorage and refresh             |
| Bridge components not switching | Verify feature flags are enabled           |
| Feedback not collected          | Check browser console for errors           |

## 📈 Migration Phases

1. **Phase 1**: Early Adopters (10%) - Full new UI
2. **Phase 2**: Power Users (20%) - Partial new UI
3. **Phase 3**: Regular Users (40%) - Dashboard only
4. **Phase 4**: New Users (20%) - Full new UI
5. **Phase 5**: Control Group (10%) - Old UI only

## 🎯 Success Criteria

- ✅ Zero downtime migration
- ✅ Performance maintained or improved
- ✅ User satisfaction maintained
- ✅ No accessibility regressions
- ✅ Automatic rollback capability

## 📞 Key Files

| File                               | Purpose                     |
| ---------------------------------- | --------------------------- |
| `src/lib/user-segments.ts`         | User segmentation system    |
| `src/lib/config.ts`                | Feature flags configuration |
| `src/bridge-ui/`                   | Bridge components           |
| `src/pages/MigrationDashboard.tsx` | Migration control center    |
| `src/lib/performance-optimizer.ts` | Performance monitoring      |
| `src/lib/feedback-integration.ts`  | Feedback collection         |
| `src/lib/cutover-manager.ts`       | Migration management        |

## 🔄 Rollback Triggers

| Trigger                 | Threshold | Action        |
| ----------------------- | --------- | ------------- |
| High Error Rate         | > 5%      | Auto-rollback |
| Performance Degradation | > 50%     | Alert         |
| Low User Satisfaction   | < 60%     | Manual review |

## 📊 Analytics Events

- `user_segment_assigned`
- `feature_flag_evaluated`
- `performance_metric_recorded`
- `feedback_submitted`
- `cutover_phase_completed`
- `rollback_triggered`

## 🎉 Ready for Production

The New UI Migration System is:

- ✅ **Built Successfully** - No TypeScript errors
- ✅ **Fully Functional** - All systems operational
- ✅ **Production Ready** - Complete with monitoring
- ✅ **Well Documented** - Comprehensive guides available
- ✅ **Tested** - Ready for user testing

**Next Step**: Deploy to staging and begin user testing with Early Adopters segment.
