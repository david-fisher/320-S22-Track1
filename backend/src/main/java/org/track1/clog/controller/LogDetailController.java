package org.track1.clog.controller;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import java.util.ArrayList;
import java.sql.Timestamp;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.track1.clog.model.LogDetail;
import org.track1.clog.repository.LogDetailRepository;
import org.springframework.data.jpa.convert.QueryByExamplePredicateBuilder;
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.Predicate;

@CrossOrigin(origins = "http://localhost:8080")
@RestController
@RequestMapping("/api")
public class LogDetailController {
    @Autowired
    LogDetailRepository logDetailRepository;

    @GetMapping("/log_detail")
    //severity_low - lower bound, severity_high - upper bound, same for priority
    //all timestamps must follow this format: 'yyyy-dd-mm hh.mi.ss.ms' for example 01-JAN-22 12.55.03.480000 AM would be 2022-01-01 00:55:03.480000
    public ResponseEntity<List<LogDetail>> getByGlobalInstanceId(@RequestParam(required = false) String global_instance_id, @RequestParam(required = false) String business_domain, @RequestParam(required = false) String business_subdomain,
                                                           @RequestParam(required = false) String version, @RequestParam(required = false) String local_instance_id, @RequestParam(required = false) String eai_transaction_id,
                                                           @RequestParam(required = false) String eai_domain, @RequestParam(required = false) String hostname, @RequestParam(required = false) String application,
                                                           @RequestParam(required = false) String event_context, @RequestParam(required = false) String component, @RequestParam(required = false) Integer severity_low,
                                                           @RequestParam(required = false) Integer severity_high, @RequestParam(required = false) Integer priority_low, @RequestParam(required = false) Integer priority_high, 
                                                           @RequestParam(required = false) Timestamp creation_time_start, @RequestParam(required = false) Timestamp creation_time_end,
                                                           @RequestParam(required = false) String reasoning_scope, @RequestParam(required = false) Integer process_id, @RequestParam(required = false) String category_name,
                                                           @RequestParam(required = false) String activity, @RequestParam(required = false) String msg) {
        
        LogDetail logExample = new LogDetail(global_instance_id,business_domain,business_subdomain,version,local_instance_id,eai_transaction_id,eai_domain,hostname,application,event_context,component,null,null,null,reasoning_scope,process_id,category_name,activity,msg); 
        ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
        Example<LogDetail> logQuery = Example.of(logExample,matcher); 
        try {
            List<LogDetail> logs = logDetailRepository.findAll(getByDatesPrioritySeverity(severity_low,severity_high,priority_low,priority_high,creation_time_start,creation_time_end,logQuery));
            // no data
            if (logs.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(logs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Specification<LogDetail> getByDatesPrioritySeverity(Integer severity_low, Integer severity_high, Integer priority_low, Integer priority_high, Timestamp start, Timestamp end, Example<LogDetail> example){
        return  (root,query,builder) -> {
            final List<Predicate> predicates = new ArrayList<Predicate>();
            if (severity_low != null){
                predicates.add(builder.greaterThanOrEqualTo(root.get("severity"), severity_low));
            }
            if (severity_high != null){
                predicates.add(builder.lessThanOrEqualTo(root.get("severity"), severity_high));
            }
            if (priority_low != null){
                predicates.add(builder.greaterThanOrEqualTo(root.get("priority"), priority_low));
            }
            if (priority_high != null){
                predicates.add(builder.lessThanOrEqualTo(root.get("priority"), priority_high));
            }
            if (start != null){
                predicates.add(builder.greaterThanOrEqualTo(root.get("creationTime"), start));
            }
            if (end != null){
                predicates.add(builder.lessThanOrEqualTo(root.get("creationTime"), end));
            }
            predicates.add(QueryByExamplePredicateBuilder.getPredicate(root, builder, example));
            Predicate[] predArr = predicates.toArray(new Predicate[predicates.size()]);
            return builder.and(predArr);
        };
    }

}
